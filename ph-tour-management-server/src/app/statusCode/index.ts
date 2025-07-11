import sCode from "http-status-codes";

export default sCode;

/*

 Code   Name                        Meaning / Use Case               
 ----------------------------------------------------------------------
 1xx    Informational               (Rarely used directly in APIs)   
 100    Continue                    Initial part of request received 

 2xx — Success

 200    OK                          Request successful, response contains the data
 201    Created                     Resource created successfully (e.g. after POST)
 204    No Content                  Success but no response body (e.g. after DELETE)

 3xx — Redirection

 301    Moved Permanently           Resource permanently moved to new URL
 302    Found (Temporary Redirect)  Resource temporarily moved

 4xx — Client Errors

 400    Bad Request                 Invalid input (e.g. validation error, malformed request)
 401    Unauthorized                Authentication required or failed
 403    Forbidden                   Authenticated but access not allowed
 404    Not Found                   Resource does not exist
 409    Conflict                    Conflict in request (e.g. duplicate data)
 422    Unprocessable Entity        Valid format but semantic error (often used for validation)

 5xx — Server Errors

 500    Internal Server Error       Generic error on server (e.g. unhandled exception)
 501    Not Implemented             Endpoint not implemented yet
 503    Service Unavailable         Server is down or overloaded

 */
