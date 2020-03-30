import Locale from './simple-locale'
import {JSONPath} from 'jsonpath-plus';
import JSONPointer from 'json-pointer'

const langFiles = require.context("../i18n", true, /^(.*\.(json$))/i);
const localeNames = langFiles.keys().map((i)=>{
    let L=i.match(/([a-z]{2}_[a-z]{2})/gi)
    if (L) return L[0]; return null;
}).filter((i)=>(i!==null))

export const locale =  new Locale(localeNames.reduce((obj,v)=>( {...obj,[v]:v}),{}));
langFiles.keys().forEach((file,i)=>{ locale.load(locale[localeNames[i]], langFiles(file));});


export const translateSchema = function(jsonSchema){
   JSONPath({json: jsonSchema,path:'$..[title,description]@string()',resultType:"pointer"}).forEach(function(p){
       JSONPointer.set(jsonSchema,p,locale.get(JSONPointer.get(jsonSchema,p)));
    });
    
   return jsonSchema;
}