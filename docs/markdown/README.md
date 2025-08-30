# Documentation for Job Agents API

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost:4000/api*

| Class | Method | HTTP request | Description |
|------------ | ------------- | ------------- | -------------|
| *AgentsApi* | [**agentsRunApplierPost**](Apis/AgentsApi.md#agentsrunapplierpost) | **POST** /agents/run-applier | Run Applier Agent |
*AgentsApi* | [**agentsRunResearcherPost**](Apis/AgentsApi.md#agentsrunresearcherpost) | **POST** /agents/run-researcher | Run Researcher Agent |
*AgentsApi* | [**agentsRunsGet**](Apis/AgentsApi.md#agentsrunsget) | **GET** /agents/runs | Get Agent Runs |
| *ApplicationsApi* | [**applicationsApplyNextBatchPost**](Apis/ApplicationsApi.md#applicationsapplynextbatchpost) | **POST** /applications/apply-next-batch | Process Application Batch |
*ApplicationsApi* | [**applicationsGet**](Apis/ApplicationsApi.md#applicationsget) | **GET** /applications | Get Applications |
*ApplicationsApi* | [**applicationsIdPatch**](Apis/ApplicationsApi.md#applicationsidpatch) | **PATCH** /applications/{id} | Update Application |
*ApplicationsApi* | [**applicationsPost**](Apis/ApplicationsApi.md#applicationspost) | **POST** /applications | Create Application |
| *HealthApi* | [**healthGet**](Apis/HealthApi.md#healthget) | **GET** /health | Health Check |
| *JobsApi* | [**jobsGet**](Apis/JobsApi.md#jobsget) | **GET** /jobs | Get All Jobs |
*JobsApi* | [**jobsImportPost**](Apis/JobsApi.md#jobsimportpost) | **POST** /jobs/import | Import Jobs |
*JobsApi* | [**jobsPost**](Apis/JobsApi.md#jobspost) | **POST** /jobs | Create Job |
| *QuestionsApi* | [**questionsCreatePost**](Apis/QuestionsApi.md#questionscreatepost) | **POST** /questions/create | Create Question |
*QuestionsApi* | [**questionsGet**](Apis/QuestionsApi.md#questionsget) | **GET** /questions | Get Questions |
*QuestionsApi* | [**questionsIdPatch**](Apis/QuestionsApi.md#questionsidpatch) | **PATCH** /questions/{id} | Answer Question |


<a name="documentation-for-models"></a>
## Documentation for Models

 - [AgentRun](./Models/AgentRun.md)
 - [AgentType](./Models/AgentType.md)
 - [Application](./Models/Application.md)
 - [ApplicationCreate](./Models/ApplicationCreate.md)
 - [ApplicationStatus](./Models/ApplicationStatus.md)
 - [ApplicationUpdate](./Models/ApplicationUpdate.md)
 - [ApplicationWithJob](./Models/ApplicationWithJob.md)
 - [ErrorResponse](./Models/ErrorResponse.md)
 - [EventType](./Models/EventType.md)
 - [Job](./Models/Job.md)
 - [JobCreate](./Models/JobCreate.md)
 - [JobImport](./Models/JobImport.md)
 - [Question](./Models/Question.md)
 - [QuestionCreate](./Models/QuestionCreate.md)
 - [QuestionStatus](./Models/QuestionStatus.md)
 - [QuestionWithJob](./Models/QuestionWithJob.md)
 - [_agents_run_researcher_post_200_response](./Models/_agents_run_researcher_post_200_response.md)
 - [_applications_apply_next_batch_post_200_response](./Models/_applications_apply_next_batch_post_200_response.md)
 - [_applications_apply_next_batch_post_request](./Models/_applications_apply_next_batch_post_request.md)
 - [_applications_post_200_response](./Models/_applications_post_200_response.md)
 - [_health_get_200_response](./Models/_health_get_200_response.md)
 - [_health_get_500_response](./Models/_health_get_500_response.md)
 - [_jobs_import_post_200_response](./Models/_jobs_import_post_200_response.md)
 - [_jobs_post_201_response](./Models/_jobs_post_201_response.md)
 - [_questions__id__patch_200_response](./Models/_questions__id__patch_200_response.md)
 - [_questions__id__patch_request](./Models/_questions__id__patch_request.md)
 - [_questions_create_post_200_response](./Models/_questions_create_post_200_response.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

All endpoints do not require authorization.
