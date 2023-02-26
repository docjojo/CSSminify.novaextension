// CSSminify Extension for Nova
// Copyright © 2023 atec-systems. All rights reserved.

class CssMinService {
  
	constructor() {	}

  get getArgs() {
    
    var sourceMap = nova.config.get('atec-systems.CCSminify.sourceMap'); 
    var execPath  = nova.config.get('atec-systems.CCSminify.execPath');       
    
    if(!execPath) { execPath = 'uglifycss'; }            
    execPath = execPath.replace(/(\s+)/g, '\\$1');
    
    var options = [];    
    options.push(execPath);
 
   return options;
  }
 
  minifyCssFile(source) 
  {
    if(source.substr(-3) != 'css' || source.substr(-7) == 'min.css') { return } 
    var target = source.replace('.css', '.min.css');
        
    var args = this.getArgs;
        args.push(source);        
        args.push("--output");
        args.push(target);

    var test=args.join(" ");
 
    var options = { args: args };
    var process = new Process("/usr/bin/env", options);
        
     var stdOut = new Array;
     process.onStdout(function(line) { stdOut.push(line.trim()); });
     var stdErr = new Array;
     process.onStderr(function(line) { stdErr.push(line.trim()); });
 
     process.onDidExit(function() 
     {

       if(stdErr.length > 0) {     
         
        if(nova._notificationTimer) { clearTimeout(nova._notificationTimer); }                
             
         var message = stdErr.splice(0, 2).join("\n");
    
         let request = new NotificationRequest("css-error");      
         request.title = nova.localize("StyleSheet Compile Error");
         request.body = nova.localize(message);  
         request.actions = [nova.localize("Dismiss")];        
         let promise = nova.notifications.add(request);
         
         nova._notificationTimer = setTimeout(function() { nova.notifications.cancel("css-error"); }, 10000); }  
         else { nova.notifications.cancel("css-error"); }
     });
 
     process.start();    
  }  
  
  minifyCssFileOnSave(editor) 
  {
    var source   = editor.document.path;
    var minifyOnSave  = nova.config.get('atec-systems.CCSminify.minifyOnSave');    
    if(minifyOnSave == 'No') { return; }
    this.minifyCssFile(source);
    return;
  }  

  minifyCssFileOnCommand(editor) 
  {
    var source   = editor.document.path;
    if (editor.document.isDirty) editor.save();
    var minifyOnSave  = nova.config.get('atec-systems.CCSminify.minifyOnSave');    
    if(minifyOnSave == 'No') { this.minifyCssFile(source); };
    return;
  };

};
module.exports = CssMinService;
