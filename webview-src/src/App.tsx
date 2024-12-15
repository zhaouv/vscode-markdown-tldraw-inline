// import React from 'react';
import { TLUiOverrides, TLComponents, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

////////////////////lzstring////////////////////
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.5
var LZString=function(){var r=String.fromCharCode,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",e={};function t(r,o){if(!e[r]){e[r]={};for(var n=0;n<r.length;n++)e[r][r.charAt(n)]=n}return e[r][o]}var i={compressToBase64:function(r){if(null==r)return"";var n=i._compress(r,6,function(r){return o.charAt(r)});switch(n.length%4){default:case 0:return n;case 1:return n+"===";case 2:return n+"==";case 3:return n+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(n){return t(o,r.charAt(n))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(r){return null==r?"":""==r?null:i._decompress(r.length,16384,function(o){return r.charCodeAt(o)-32})},compressToUint8Array:function(r){for(var o=i.compress(r),n=new Uint8Array(2*o.length),e=0,t=o.length;e<t;e++){var s=o.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null==o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;e<t;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(r){return null==r?"":i._compress(r,6,function(r){return n.charAt(r)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(o){return t(n,r.charAt(o))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(r,o,n){if(null==r)return"";var e,t,i,s={},u={},a="",p="",c="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<r.length;i+=1)if(a=r.charAt(i),Object.prototype.hasOwnProperty.call(s,a)||(s[a]=f++,u[a]=!0),p=c+a,Object.prototype.hasOwnProperty.call(s,p))c=p;else{if(Object.prototype.hasOwnProperty.call(u,c)){if(c.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(t=c.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=c.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[c]}else for(t=s[c],e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++),s[p]=f++,c=String(a)}if(""!==c){if(Object.prototype.hasOwnProperty.call(u,c)){if(c.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(t=c.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=c.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[c]}else for(t=s[c],e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==o-1){d.push(n(m));break}v++}return d.join("")},decompress:function(r){return null==r?"":""==r?null:i._decompress(r.length,32768,function(o){return r.charCodeAt(o)})},_decompress:function(o,n,e){var t,i,s,u,a,p,c,l=[],f=4,h=4,d=3,m="",v=[],g={val:e(0),position:n,index:1};for(t=0;t<3;t+=1)l[t]=t;for(s=0,a=Math.pow(2,2),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;switch(s){case 0:for(s=0,a=Math.pow(2,8),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;c=r(s);break;case 1:for(s=0,a=Math.pow(2,16),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;c=r(s);break;case 2:return""}for(l[3]=c,i=c,v.push(c);;){if(g.index>o)return"";for(s=0,a=Math.pow(2,d),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;switch(c=s){case 0:for(s=0,a=Math.pow(2,8),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;l[h++]=r(s),c=h-1,f--;break;case 1:for(s=0,a=Math.pow(2,16),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;l[h++]=r(s),c=h-1,f--;break;case 2:return v.join("")}if(0==f&&(f=Math.pow(2,d),d++),l[c])m=l[c];else{if(c!==h)return null;m=i+i.charAt(0)}v.push(m),l[h++]=i+m.charAt(0),i=m,0==--f&&(f=Math.pow(2,d),d++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module?module.exports=LZString:"undefined"!=typeof angular&&null!=angular&&angular.module("LZString",[]).factory("LZString",function(){return LZString});
////////////////////lzstring////////////////////


const drawAPI = {
    unstable: {
      content:"",
      nonce: () => 'ToBeReplacedByRandomToken',
      /**
       * 
       * @param {String} text text
       * @param {Number} control moving number of the cursor
       */
      editCurrentLine({ text, control, ...rest }) {
        console.log({
          text,
          control,
          file:!!rest.file,
          command: 'editCurrentLine',
        });
      },
      readSVGFileContent(file) {
        console.log({
          file,
          command: 'readSVGFile',
        })
      },
      setTextContent(content) {
        console.log(content);
        drawAPI.unstable.content=content;
      },
      setSVGContent(content) {
        globalThis.loadBundleSvg(content)
      },
      setContent(content) {
        drawAPI.unstable.setTextContent(content)
        let match;
        if (content.startsWith('<svg')) {
          drawAPI.unstable.setSVGContent(content)
        }
        else if (match = /!\[.*\]\((.*\.svg)\)/.exec(content)) {
          drawAPI.unstable.readSVGFileContent(match[1])
        }
      },
      custom(content) {
        console.log(content);
        if (content.operate) {
          content.operate.forEach(drawAPI.unstable.customOperate);
        }
      },
      customOperate(operate) {
        console.log(operate);
        if (operate.type === 'script') {
          let func = new Function(operate.function)
          func()
        }
      },
    },
}
globalThis.drawAPI = drawAPI

globalThis.addEventListener('message', event => {

    const message = event.data // The JSON data our extension sent
      || event.detail; // for debug in chrome
  
    switch (message.command) {
      case 'currentLine':
        drawAPI.unstable.setContent(message.content);
        break;
      case 'custom':
        drawAPI.unstable.custom(message.content);
        break;
      case 'readSVGFile':
        drawAPI.unstable.setSVGContent(message.content);
        break;
    }
});

(function () {
    if (typeof acquireVsCodeApi !== 'undefined') {
      const vscode = acquireVsCodeApi();
      drawAPI.unstable.editCurrentLine = ({ text, control, ...rest }) => {
        vscode.postMessage({
          text,
          control,
          file:!!rest.file,
          command: 'editCurrentLine',
        })
      }
      drawAPI.unstable.readSVGFileContent = (file) => {
        vscode.postMessage({
          file,
          command: 'readSVGFile',
        })
      }
      vscode.postMessage({ command: 'requestCurrentLine' })
      vscode.postMessage({ command: 'requestCustom' })
      globalThis.editor_mounted=()=>{
        vscode.postMessage({ command: 'requestCurrentLine' })
      }
    }
}());



const saveBundleSvg = ()=>{
    let payload=LZString.compressToBase64(JSON.stringify(editor_g.getSnapshot()))
    return editor_g.getSvgString([...editor_g.getCurrentPageShapeIds()], {
        scale: 1,
        background: false,
    }).then(d=>{
        return d.svg.replace('<defs','<!-- drawinline-version:0.1 --><!-- draw-start -->'+payload+'<!-- draw-end --><defs')
    })
}
const loadBundleSvg = (svgtext)=>{
    let payload=/<!-- draw-start -->([^<]+)<!-- draw-end -->/.exec(svgtext)[1]
    editor_g.loadSnapshot(JSON.parse(LZString.decompressFromBase64(payload)))
}
globalThis.LZString=LZString
globalThis.saveBundleSvg=saveBundleSvg
globalThis.loadBundleSvg=loadBundleSvg
globalThis.click1=()=>{
    saveBundleSvg().then(e=>{
        drawAPI.unstable.setTextContent(e);
        drawAPI.unstable.editCurrentLine({
            control: 0,
            text: drawAPI.unstable.content
        })
    })
}
globalThis.click2=()=>{
    saveBundleSvg().then(e=>{
        drawAPI.unstable.setTextContent(e);
        drawAPI.unstable.editCurrentLine({
            control: 0,
            text: drawAPI.unstable.content,
            file: true
        })
    })
}

const click1= ()=>{globalThis.click1()}
const click2= ()=>{globalThis.click2()}
const Zone1 = () => {
    return (
        <h3>
            <span onClick={click1} style={{ zIndex: 100000, pointerEvents: "all" }} title='Save Inline F2/Ctrl+s'>💾&nbsp;&nbsp;&nbsp;</span>
            <span onClick={click2} style={{ zIndex: 100000, pointerEvents: "all" }} title='Save To File F3/Ctrl+Shift+s'>🗂️&nbsp;&nbsp;&nbsp;</span>
        </h3>
    );
};
// const Zone2 = () => {
//     return (
//         <h1 onClick={click1} style={{ zIndex: 100000, pointerEvents: "all" }} title='Ctrl+s'>💾</h1>
//     );
// };

const components: TLComponents = {
	SharePanel: Zone1,
	// TopPanel: Zone2,
}

const overrides: TLUiOverrides = {
	actions(_editor, actions) {
		// You can delete actions, but remember to
		// also delete the menu items that reference them!
		// delete actions['insert-embed']

		// Create a new action or replace an existing one
		actions['save-current-line'] = {
			id: 'save-current-line',
			label: 'Save Current Line',
			readonlyOk: true,
			kbd: 'f2,$s',
			onSelect(source: any) {
				globalThis.click1()
			},
		}
		actions['save-to-file'] = {
			id: 'save-to-file',
			label: 'Save To File',
			readonlyOk: true,
			kbd: 'f3,$!s',
			onSelect(source: any) {
				globalThis.click2()
			},
		}
		return actions
	},
}

const App = () => {
    return (
        <div>
            <div style={{ position: 'fixed', inset: 0 }}>
                <Tldraw 
                    components={components}
                    onMount={(editor) => {globalThis.editor_g=editor;globalThis?.editor_mounted?.call()}}
                    options={{ maxPages: 1 }}
                    overrides={overrides}
                    persistenceKey="tldrawinline"
                />
            </div>
        </div>
    );
};

export default App;
