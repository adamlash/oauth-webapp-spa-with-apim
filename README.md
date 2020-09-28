# aad-oauth-spa-with-apim
Azure AD authenticated with Oauth to an SPA backed by APIs from APIM. This Demo is using EasyAuth on WebApps (https://docs.microsoft.com/en-us/azure/app-service/overview-authentication-authorization)

## Goals
To show a Single Page Application authenticated with AAD using Oauth 2.0 and OIDC, with that same authenticaiton used to authorize relevant backend services.

## Tech Used/Displayed in this demo
1. APIs build on Azure Function Apps
2. APIs served from APIM
3. Azure WebApp hosting SPA
4. Identities registered in App Registrations

## Frontend Design
Basic React Frontend from https://github.com/edisga/azure-webapps-easyauth-frontend-backend. Hosted on nodejs 10 WebApp

## API Design
Basic API from https://docs.microsoft.com/en-us/azure/api-management/howto-protect-backend-frontend-azure-ad-b2c example hosted on Function App

## APIM Configurations
APIM configured with the following
- API Fronted from Above
- oauth2 configured in the APIM using the 'backend' app registration
- 'frontend' app registration allowed access to the 'backend' exposed APIs

## APP Registrations
- 'frontend' used by the SPA
- 'backend' used by APIM

'frontend' has access to query the 'backend' exposed APIS
