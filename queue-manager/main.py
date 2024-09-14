import json
import logging
from os import environ
from pathlib import Path
from threading import Thread
from uuid import uuid4

import requests
import werkzeug
from flask import Flask, jsonify, request

app = Flask(__name__)

UPLOAD_FOLDER: Path | None = None
BASE_API_URL: str | None = None

# In-memory job store
jobs = {}

JOB_PENDING = "pending"
JOB_IN_PROGRESS = "in_progress"
JOB_DONE = "done"
JOB_FAILED = "failed"


class Job:
    def __init__(self, job_id, data):
        self.job_id = job_id
        self.data = data
        self.status = JOB_PENDING
        self.result = None


class CustomFormatter(logging.Formatter):
    """Custom formatter for Python logging with aligned log messages"""

    # Fixed width for log level (left-aligned)
    max_level_width = len("CRITICAL")
    _format = (
        "%(asctime)s.%(msecs)03d %(levelname)-" + str(max_level_width) + "s %(message)s"
    )

    def __init__(self):
        super().__init__(fmt=self._format, datefmt="%H:%M:%S")


# Saves the uploaded file and returns a UUID
def save_image(image: werkzeug.datastructures.FileStorage, image_type: str) -> str:
    token = str(uuid4())
    file_path = UPLOAD_FOLDER / token
    image.save(file_path)

    return token


@app.route("/api/images/face", methods=["POST"])
def upload_face_image():
    if "face" not in request.files:
        return jsonify({"error": "No face image provided"}), 400

    face_image = request.files["face"]
    if face_image.filename == "":
        return jsonify({"error": "No selected image"}), 400

    token = save_image(face_image, "face")
    return jsonify({"face_name": token}), 201


@app.route("/api/images/target", methods=["POST"])
def upload_target_image():
    if "target" not in request.files:
        return jsonify({"error": "No target image provided"}), 400

    target_image = request.files["target"]
    if target_image.filename == "":
        return jsonify({"error": "No selected image"}), 400

    token = save_image(target_image, "target")
    return jsonify({"target_name": token}), 201


def upload_images_to_api(
    face_token: str, target_token: str, options: dict | None, headers: dict
):
    face_image_path = UPLOAD_FOLDER / face_token
    target_image_path = UPLOAD_FOLDER / target_token

    files = {
        "face": face_image_path.open("rb"),
        "target": target_image_path.open("rb"),
    }

    try:
        return requests.post(
            f"{BASE_API_URL}/api/swap/all",
            files=files,
            headers=headers,
            data=(
                {
                    "options": json.dumps(options),
                }
                if options
                else None
            ),
        )
    except Exception as e:
        logging.error(f"Error uploading images: {e}")
        raise
    finally:
        files["face"].close()
        files["target"].close()


# Calls the backend API
def call_backend_api(job_id, job_data, auth_header):
    jobs[job_id].status = JOB_IN_PROGRESS
    try:
        headers = {"Authorization": auth_header}
        face_token = job_data["face_name"]
        target_token = job_data["target_name"]
        options = job_data.get("options")

        response = upload_images_to_api(face_token, target_token, options, headers)

        jobs[job_id].result = response.json()
        logging.info(response.json())
        if response.status_code == 200:
            jobs[job_id].status = JOB_DONE
        else:
            jobs[job_id].status = JOB_FAILED
    except Exception as e:
        print(f"Error processing job {job_id}: {e}")
        jobs[job_id].status = JOB_FAILED


@app.route("/api/jobs/generate", methods=["PUT"])
def create_job():
    job_data = request.json

    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 400

    face_name = job_data.get("face_name")
    target_name = job_data.get("target_name")

    if not face_name or not isinstance(face_name, str) or face_name.strip() == "":
        return jsonify({"error": "Invalid or missing 'face_name' parameter"}), 400

    if not target_name or not isinstance(target_name, str) or target_name.strip() == "":
        return jsonify({"error": "Invalid or missing 'target_name' parameter"}), 400

    job_id = str(uuid4())
    jobs[job_id] = Job(job_id, job_data)

    thread = Thread(target=call_backend_api, args=(job_id, job_data, auth_header))
    thread.start()

    return jsonify({"job_id": job_id}), 202


@app.route("/api/jobs/<job_id>", methods=["GET"])
def get_job_status(job_id):
    job = jobs.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    response = {
        "job_id": job_id,
        "status": job.status,
        "result": job.result,
    }
    return jsonify(response), 200


if __name__ == "__main__":
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)

    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(CustomFormatter())
    root_logger.addHandler(ch)

    UPLOAD_FOLDER = environ.get("UPLOAD_FOLDER") or Path("files")
    UPLOAD_FOLDER.mkdir(exist_ok=True)

    if "BASE_API_URL" not in environ:
        logging.critical("Missing variable BASE_API_URL")
        exit(1)
    else:
        BASE_API_URL = environ["BASE_API_URL"]

    app.run(debug=True)
