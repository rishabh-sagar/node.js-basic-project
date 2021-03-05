
//const a='rishabh'
//console.log(a)
const replaceTemplate= require('./modules.js/replaceTemplates');
const { Console } = require('console');
const fs =require('fs');
const http =require('http');
const url =require('url');
const slugify = require('slugify');
// const { Server } = require('http');
// const { Http2ServerRequest } = require('http2');
////////////////////////////////
/////FILES 

//Synchronous way,Blocking
// const textIn=fs.readFileSync('./txt/input.txt','utf-8')

// console.log(textIn);

// const textOut ='This is what we know about the avacado. ${textIn}.\n Created on ${Date.now()}';
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('File writtten!');

//Non Blocking Asynchronous way

// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{

//     if(err){
//         return console.log('ERROR!!!!!1');
//     };
        
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2);
                
//         fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
//                 console.log(data3);
            
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',err=>{
//                         console.log('Your file has been written');
//             })  
            
            
//         });
//     });
// });





// console.log('will read file');

////////////////////////
/////SERVER
const JSONdata =fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const tempProduct =fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');
const tempCard =fs.readFileSync(`${__dirname}/templates/card.html`,'utf-8');
const tempOverview =fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const dataObject=JSON.parse(JSONdata);

const slugs =dataObject.map(el => slugify(el.productName,{
    lower: true
}));

const server = http.createServer((req,res) =>{
    //const PathUrl=req.url;
    const {query,pathname}=url.parse(req.url,true);
    
    //Overview Page
    if(pathname==='/' || pathname==='/overview'){
        res.writeHead(200,{
            'Content-type':'text/html'
        });

        const cardHtml=dataObject.map(el=> replaceTemplate(tempCard,el)).join(' ');
        const output =tempOverview.replace('{%PRODUCT_CARDS%}',cardHtml);
        res.end(output);
    }
    
    //Product Page
    else if(pathname==='/product'){
        res.writeHead(200,{
            'Content-type':'text/html'
        });
        const product = dataObject[query.id];
        const output = replaceTemplate(tempProduct,product);
        res.end(output);
    }
    
    //About
    else if(pathname==='/about'){
        res.end('Pls Respect Someone privacy');
    }
    
    //API
    else if(pathname==='/api'){
        res.writeHead(200,{
            'Content-type':'application/json'
        });
        res.end(JSONdata);
    }
    else{
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'hello-world'
        });
        res.end('<h1>page not found</h1>');
    }

    //res.end('Hello from the server');
});

server.listen(9000, '127.0.0.1', ()=>{
    console.log('Listening to requests on port 9000');
}); 