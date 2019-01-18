Algorithm for importing InformationModel from OpenApi spec.


1) generate metadata fields, (id, uri, title, publisher)
import title = apispec.title 

2) property "schema" is of type JsonSchema, therefore it has $id with self-reference.

Notably, the self-reference of the schema is not reference to InformationModel, but InformationModel.schema, 
therefore $id="<im-url>/schema"

Schema has no content, because it is not meant to be used for validating a json-document, 
We only use the schema to contain interconnected component schemas it is only used for component definitions.

Component definitions are transferred from ApiSpec in following way:

[schema]definitions.<component>=[OpenApi]components.schemas.<component>

Note that this transformation affects the inter-component references. 
for example, if in OpenApi, there is reference, 
"$ref": "#/components/schemas/Organisasjonsform", 
then it will be translated in JsonSchema to "$ref": "#/definitions/Organisasjonsform"

(when i did it manuyally, I jused find/replace, hint-hint)




