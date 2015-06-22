# cmnd.center

cmnd.center is a project of mine to create an API for APIs / a command line in the cloud / a text to API bridge. Plugins are added on the website (http://cmnd.center) and can then be used from anywhere via the cmnd API. The only client currently available is a terminal client. The project is still in its infancy.

What is the point?
* One environment everywhere. Install one tool and have access to all command line tools.
* Authenticating with OAuth APIs is much easier in a browser environment.
* Long-term vision of more complex plugins that can accept text from any text source (including speech) and respond with the relevant format.

Normally the site is available at http://cmnd.center, but I'm currently rebuilding and refactoring.

##Plugins
Plugins are a javascript file exposing four functions via an application.remote.api object.
* ```command``` process the command
* ```getRedirect``` handles get redirects to an endpoint created for the plugin. This is for handling OAuth flow redirects.
* ```postRedirect``` handles post to the same URL as getRedirect. This would primarily be posted to from a form in the configHtml.
* ```configHtml``` provides, most likely, a form for changing settings.

Plugins are provided via application.remote.<function>:
* ```request``` for making requests
* ```getStorage``` and ```setStorage``` for setting JSON.
* ```response``` for sending the response
* ```setTimeout```

###What I'm implementing now
* I'm switching the API to cmnd from OAuth to Basic Auth. OAuth will be needed someday, but I think it's premature.
* I'm now using the npm module jailed to run plugins (which are untrusted code) in a sandbox in a separate thread. Ideally, this will allow anyone to upload whatever plugins they want without needing human approval. Plugins are destroyed after a two second timeout if they don't respond or destroy themselves. 
* Similarly, config HTML is placed into a sandboxed iframe with no JavaScript capabilities.
