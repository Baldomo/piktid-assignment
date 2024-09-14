import { SwapGenerateResponse } from "@/lib/api"

export type JobRequest = {
  face_name: string
  target_name: string
}

export type JobCreationResponse = {
  job_id: string
}

export type JobStatus = "pending" | "in_progress" | "done" | "failed"

export type JobStatusResponse = {
  job_id: string
  status: JobStatus
  result?: SwapGenerateResponse // Result will only be present when the job is done
}
