# QuestionsApi

All URIs are relative to *http://localhost:4000/api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**questionsCreatePost**](QuestionsApi.md#questionsCreatePost) | **POST** /questions/create | Create Question |
| [**questionsGet**](QuestionsApi.md#questionsGet) | **GET** /questions | Get Questions |
| [**questionsIdPatch**](QuestionsApi.md#questionsIdPatch) | **PATCH** /questions/{id} | Answer Question |


<a name="questionsCreatePost"></a>
# **questionsCreatePost**
> _questions_create_post_200_response questionsCreatePost(QuestionCreate)

Create Question

    Create a new question for a job application

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **QuestionCreate** | [**QuestionCreate**](../Models/QuestionCreate.md)|  | |

### Return type

[**_questions_create_post_200_response**](../Models/_questions_create_post_200_response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="questionsGet"></a>
# **questionsGet**
> List questionsGet(status)

Get Questions

    Retrieve questions with optional status filtering

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **status** | [**QuestionStatus**](../Models/.md)| Filter questions by status | [optional] [default to null] [enum: OPEN, ANSWERED, INVALID] |

### Return type

[**List**](../Models/QuestionWithJob.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="questionsIdPatch"></a>
# **questionsIdPatch**
> _questions__id__patch_200_response questionsIdPatch(id, \_questions\_\_id\_\_patch\_request)

Answer Question

    Provide an answer to a question and update its status

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **Integer**| Question ID | [default to null] |
| **\_questions\_\_id\_\_patch\_request** | [**_questions__id__patch_request**](../Models/_questions__id__patch_request.md)|  | |

### Return type

[**_questions__id__patch_200_response**](../Models/_questions__id__patch_200_response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

