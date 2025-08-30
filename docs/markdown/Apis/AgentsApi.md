# AgentsApi

All URIs are relative to *http://localhost:4000/api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**agentsRunApplierPost**](AgentsApi.md#agentsRunApplierPost) | **POST** /agents/run-applier | Run Applier Agent |
| [**agentsRunResearcherPost**](AgentsApi.md#agentsRunResearcherPost) | **POST** /agents/run-researcher | Run Researcher Agent |
| [**agentsRunsGet**](AgentsApi.md#agentsRunsGet) | **GET** /agents/runs | Get Agent Runs |


<a name="agentsRunApplierPost"></a>
# **agentsRunApplierPost**
> _applications_apply_next_batch_post_200_response agentsRunApplierPost(\_applications\_apply\_next\_batch\_post\_request)

Run Applier Agent

    Execute the applier agent to process application batches (mock implementation)

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **\_applications\_apply\_next\_batch\_post\_request** | [**_applications_apply_next_batch_post_request**](../Models/_applications_apply_next_batch_post_request.md)|  | [optional] |

### Return type

[**_applications_apply_next_batch_post_200_response**](../Models/_applications_apply_next_batch_post_200_response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="agentsRunResearcherPost"></a>
# **agentsRunResearcherPost**
> _agents_run_researcher_post_200_response agentsRunResearcherPost()

Run Researcher Agent

    Execute the researcher agent to find and import new jobs (mock implementation)

### Parameters
This endpoint does not need any parameter.

### Return type

[**_agents_run_researcher_post_200_response**](../Models/_agents_run_researcher_post_200_response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="agentsRunsGet"></a>
# **agentsRunsGet**
> List agentsRunsGet()

Get Agent Runs

    Retrieve history of agent executions

### Parameters
This endpoint does not need any parameter.

### Return type

[**List**](../Models/AgentRun.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

