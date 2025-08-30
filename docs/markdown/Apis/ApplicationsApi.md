# ApplicationsApi

All URIs are relative to *http://localhost:4000/api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**applicationsApplyNextBatchPost**](ApplicationsApi.md#applicationsApplyNextBatchPost) | **POST** /applications/apply-next-batch | Process Application Batch |
| [**applicationsGet**](ApplicationsApi.md#applicationsGet) | **GET** /applications | Get Applications |
| [**applicationsIdPatch**](ApplicationsApi.md#applicationsIdPatch) | **PATCH** /applications/{id} | Update Application |
| [**applicationsPost**](ApplicationsApi.md#applicationsPost) | **POST** /applications | Create Application |


<a name="applicationsApplyNextBatchPost"></a>
# **applicationsApplyNextBatchPost**
> _applications_apply_next_batch_post_200_response applicationsApplyNextBatchPost(\_applications\_apply\_next\_batch\_post\_request)

Process Application Batch

    Process a batch of applications with automated status updates (mock implementation)

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

<a name="applicationsGet"></a>
# **applicationsGet**
> List applicationsGet(status)

Get Applications

    Retrieve applications with optional status filtering

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **status** | [**ApplicationStatus**](../Models/.md)| Filter applications by status | [optional] [default to null] [enum: APPLIED, PARTIAL_FILLED, LOGIN_REQUIRED, IN_PROGRESS, FAILED, SKIPPED] |

### Return type

[**List**](../Models/ApplicationWithJob.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="applicationsIdPatch"></a>
# **applicationsIdPatch**
> _applications_post_200_response applicationsIdPatch(id, ApplicationUpdate)

Update Application

    Update application status and notes

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **Integer**| Application ID | [default to null] |
| **ApplicationUpdate** | [**ApplicationUpdate**](../Models/ApplicationUpdate.md)|  | |

### Return type

[**_applications_post_200_response**](../Models/_applications_post_200_response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="applicationsPost"></a>
# **applicationsPost**
> _applications_post_200_response applicationsPost(ApplicationCreate)

Create Application

    Create a new job application

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ApplicationCreate** | [**ApplicationCreate**](../Models/ApplicationCreate.md)|  | |

### Return type

[**_applications_post_200_response**](../Models/_applications_post_200_response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

