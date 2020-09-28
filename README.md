# oauth-webapp-spa-with-apim
Azure AD authenticated with Oauth to an SPA backed by APIs from APIM. This Demo is using EasyAuth on WebApps (https://docs.microsoft.com/en-us/azure/app-service/overview-authentication-authorization)

## Goals
Demo WebApp using EasyAuth to Authenticate to APIs in APIM using OAuth from an SPA.

## Tech Used/Displayed in this demo
1. APIs served from API Management
3. Azure WebApp hosting SPA
4. Identities registered in App Registrations

## API Management and Oauth Setup
### 1. Create an APIM install
- Nothing special here, just follow the setup in the GUI, if you dont have an API Management Already.
- If you want some APIS to actually live in your account, I used: https://docs.microsoft.com/en-us/azure/api-management/import-and-publish down here, you can import the OpenAPI Specification and choose one of these.

### 2. Follow Documentation to Secure your APIs with Oauth 2.0

https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-protect-backend-with-aad 

Denote a few things when going through this setup
1. 	**MUST USE V1 NOT V2 ENDPOINTS**. Whenever it says v1 api, please use and follow v1 API practices. This is due to EasyAuth supporting V1 right now. *Need to test with V2 but only had the time to test on V1.*
2. Determine if your APIs will have subscription keys or not as well, if so you will need to provide the subscription key as part of the query of the API itself.


***Confirm all is working fine from the developers portal before going forward, you should be able to query the API with your Bearer token***


## WebApp and EasyAuth Setup
### 1. Create Webapp
In this case I went with a Node 10 Windows WebApp, but I'm just copying up the output of the `react-scripts build` js, so anything that can host a javascript page is fine, really.


### 2. Configure Authentication and Authorization (EasyAuth)
1. In this case we want to go to Settings > Authentication / Authorization
2. (Optional) If you are using my example I don’t have a 'login' button, so I have set the 'Action to take when request is not authenticated' to 'Log inwith Azure Active Directory'. Since it'll force a login.
3. Once in here, we flick the Authentication to Yes and setup authentication provider 'Azure Active Directory'
4. Choose 'Express' and select the FRONTEND/CLIENT app you created in the APIM oauth 2.0 setup.
5. Click Okay
6. Go back to the FRONTENT/CLIENT app in App Registrations and select 'Authentication'
7. Add https://**APPNAME**.azurewebsites.net/.auth/login/aad/callback where appname is your azure sites appname (you should be able to determine the URL)
Tick the Box 'ID Tokens'. Needed for EasyAuth

### 3. Read and Deploy Code
1. Git clone https://github.com/adamlash/aad-oauth-spa-with-apim

Check out src/app.js...
- Denote *line 14*, it requests information from '/.auth/me'. This is where EasyAuth lets us query the jwt token from. You can browse here with your session and peruse some the info.
- Denote *line 27*, this is where I've lovingly hardcoded in my "Backend". So put yours in, this is just a GET.
- Then on *line 28* it creates the headers and injects our JWT token from above.


Once done, deploy it any way to your webapp you wish *(github actions has some great starter templates for this, check out this repo under **.github/workflows/azure.yml** for an example to deploy to mine)*


## Testing
1. Browse to your webapp once deployment has completed
2. It should ask you to login, so log in away.
3. Once logged in, it may ask you any claims you need to approve for you account, per standard oauth
Once you accept, you are taken to the index, where it SHOULD print your jwt token and a response from your API using your JWT token.



## Troubleshooting
There are A LOT of moving parts going on here, and oauth can be mighty confusing so some common troubleshooting pieces are:


### JWT? Claims? Tokens? Implicit? OIDC? What is all this Oauth 2.0 stuff
If this is confusing, a brilliant video on Oauth 2.0 can be found at: https://www.youtube.com/watch?v=996OiexHze0
If you watch one tech video this month, this is the one.

### My App is giving me a 'Access not Allowed' after Logging in
- Make sure you ticked 'ID Tokens' in thee App Registration > Authentication > for your FRONTEND/CLIENT

### My App seems to get 'lost' after I log in, random Microsoft Errors
- Make sure you have a redirect url inside the App Registration > Authentication > Single Page Applications for your FRONTEND/CLIENT appreg.

### My App is giving me 401: Not Authorized after I specify the JWT Policy in APIM
This can be a few things
- Make sure your Policy is CORRECT. You need to use the v1 version at the end of the document
- Confirm the policy appid matches the claim, you can do this by using the tool https://jwt.ms, like so:
  - Grab the Bearer Token from the request in your Dev Tools on the site, or from the printed copy in the SPA example
  - Paste them into jwt.ms, jwt.ms will decode this

In the decoded view, you can check the 'claims'. Make sure the aud is the same as the aud you specified in the Policy on the API itself.


### My App may be asking for API Keys when querying
You may want to specify your API Key as part of your body/querystring, or just untick the feature for testing, up to you on how you want to secure the APIs.


## Sources, Helpful Tools and References
- Microsoft JWT tester: https://jwt.ms
- Okta Video on Oauth/OIDC: https://www.youtube.com/watch?v=996OiexHze0
- Hello World API setup for API Management: https://docs.microsoft.com/en-us/azure/api-management/import-and-publish
- Source Code Example for webapp used from: https://github.com/edisga/azure-webapps-easyauth-frontend-backend (thank you!)
- Good info on APIM specific SPA stuff from: https://docs.microsoft.com/en-us/azure/api-management/howto-protect-backend-frontend-azure-ad-b2c
- EasyAuth / Authentication and Authorization on WebApps (also doco on adding login/logout buttons etc.): https://docs.microsoft.com/en-us/azure/app-service/overview-authentication-authorization
- Protecting APIs with oauth 2.0: https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-protect-backend-with-aad
