# Question
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **id** | **String** | Unique identifier for the question | [default to null] |
| **user\_id** | **UUID** | User identifier | [default to null] |
| **job\_id** | **String** | Job identifier | [default to null] |
| **application\_id** | **String** | Associated application identifier | [optional] [default to null] |
| **field\_label** | **String** | Human-readable label for the question | [default to null] |
| **help\_text** | **String** | Help text for the question | [optional] [default to null] |
| **kb\_key** | **String** | Knowledge base key for storing the answer | [optional] [default to null] |
| **answer** | **String** | User&#39;s answer to the question | [optional] [default to null] |
| **status** | [**QuestionStatus**](QuestionStatus.md) |  | [default to null] |
| **created\_at** | **Date** | When the question was created | [default to null] |
| **updated\_at** | **Date** | When the question was last updated | [default to null] |

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

