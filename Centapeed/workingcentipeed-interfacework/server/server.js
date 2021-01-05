import http from "http";
import url from "url";
import StringDecoder from ("string_decoder").StringDecoder;
import config  from "./config";

server = http.createServer = (req, res) =>
{
   parsedUrl = url.parse(req.url, true),
      path = paersedUrl.pathname,
      trimmedPath = path.replace(/^\/+|\/+$/g, '')

   queryStringObject = parsedUrl.query
   method = req.method.toLowerCase()
   headers = req.headers
   decoder = new StringDecoder('utf-8')
   buffer = '';
   req.on('data', function (data)
   {
      buffer += decoder.write(data);

   });
   req.on('end', function ()
   {
      buffer += decoder.end();
   })
}

//to call server