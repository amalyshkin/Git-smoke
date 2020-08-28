//# sourceURL=utils.js
'use strict';

function getComponent(componentName) {
	var componentAccessor = Java.type("com.atlassian.jira.component.ComponentAccessor");
	var clazz = Java.type("java.lang.Class")
	return componentAccessor.getOSGiComponentInstanceOfType(clazz.forName(componentName));
}

// Returns a logger to write into the Jira logs
function getJiraLogger() {
    return Java.type("org.apache.log4j.Logger").getLogger("com.bigbrassband.jira.git.services.scripting.ScriptService");
}
