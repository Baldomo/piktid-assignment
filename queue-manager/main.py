import logging
from os import environ
from threading import Thread
from uuid import uuid4

import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

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


# Calls the backend API
def call_backend_api(job_id, job_data, auth_header):
    jobs[job_id].status = JOB_IN_PROGRESS
    try:
        headers = {"Authorization": auth_header}
        response = requests.post(
            f"http://{BASE_API_URL}/api/swap/generate", json=job_data, headers=headers
        )

        if response.status_code == 200:
            jobs[job_id].status = JOB_DONE
            jobs[job_id].result = response.json()
        else:
            jobs[job_id].status = JOB_FAILED
    except Exception as e:
        print(f"Error processing job {job_id}: {e}")
        jobs[job_id].status = JOB_FAILED


@app.route("/jobs/generate", methods=["PUT"])
def create_job():
    job_data = request.json

    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 400

    job_id = str(uuid4())
    jobs[job_id] = Job(job_id, job_data)

    thread = Thread(target=call_backend_api, args=(job_id, job_data, auth_header))
    thread.start()

    return jsonify({"job_id": job_id}), 202


@app.route("/jobs/<job_id>", methods=["GET"])
def get_job_status(job_id):
    job = jobs.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    response = {
        "job_id": job_id,
        "status": job.status,
        "result": job.result if job.status == JOB_DONE else None,
    }
    return jsonify(response), 200


if __name__ == "__main__":
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)

    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(CustomFormatter())
    root_logger.addHandler(ch)

    if "BASE_API_URL" not in environ:
        logging.critical("Missing variable BASE_API_URL")
        exit(1)
    else:
        BASE_API_URL = environ["BASE_API_URL"]

    app.run(debug=True)
