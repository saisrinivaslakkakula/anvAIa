# JobsApi

All URIs are relative to *http://localhost:4000/api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**jobsGet**](JobsApi.md#jobsGet) | **GET** /jobs | Get All Jobs |
| [**jobsImportPost**](JobsApi.md#jobsImportPost) | **POST** /jobs/import | Import Jobs |
| [**jobsPost**](JobsApi.md#jobsPost) | **POST** /jobs | Create Job |


<a name="jobsGet"></a>
# **jobsGet**
> List jobsGet()

Get All Jobs

    Retrieve all available jobs ordered by most recently scraped

### Parameters
This endpoint does not need any parameter.

### Return type

[**List**](../Models/Job.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="jobsImportPost"></a>
# **jobsImportPost**
> _jobs_import_post_200_response jobsImportPost(JobImport)

Import Jobs

    Import multiple jobs with deduplication based on external_link or internal_id

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **JobImport** | [**List**](../Models/JobImport.md)|  | |

### Return type

[**_jobs_import_post_200_response**](../Models/_jobs_import_post_200_response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="jobsPost"></a>
# **jobsPost**
> _jobs_post_201_response jobsPost(JobCreate)

Create Job

    Create a new single job

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **JobCreate** | [**JobCreate**](../Models/JobCreate.md)|  | |

### Return type

[**_jobs_post_201_response**](../Models/_jobs_post_201_response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

