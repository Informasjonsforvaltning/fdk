#!/usr/bin/env python2.7

import os, httplib, urllib, json

def objectHasAttribute(object, attribute_name):
    try:
        attribute = object[attribute_name]
        return True
    except Exception:
        return False

def doHttpRequest(method, url, data, headers):
    try:
        safe_url = urllib.quote(url)
        conn = httplib.HTTPConnection("localhost", 8084)
        conn.request(method, safe_url, data, headers)
        response = conn.getresponse()

        return response

    except Exception, e:
        print(e)
        return;

def getAccessToken():
    keycloak_user = os.environ['KEYCLOAK_USER']
    keycloak_password = os.environ['KEYCLOAK_PASSWORD']
    url = "/auth/realms/master/protocol/openid-connect/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    params = urllib.urlencode({"username": keycloak_user, "password": keycloak_password, "grant_type": "password", "client_id": "admin-cli"})
    parsed_data = json.loads(doHttpRequest("POST", url, params, headers).read())
    return parsed_data["access_token"]

def createRealm(realm, token):
    headers = {"Authorization": "Bearer " + token, "Content-Type": "application/json;charset=UTF-8"}
    data = json.dumps({"enabled": "true", "id": realm, "realm": realm})
    create_status = doHttpRequest("POST", "/auth/admin/realms", data, headers).status
    if create_status == 201:
        print "Realm " + realm + " created"
    else:
        print "Unable to create realm " + realm

def realmIsMissing(realm, current_realms):
    for existing in current_realms:
        if existing["realm"] == realm:
            return False
    return True

def createRealmsIfMissing(realms, token):
    headers = {"Accept": "application/json", "Authorization": "Bearer " + token}
    current_realms = json.loads(doHttpRequest("GET", "/auth/admin/realms", "", headers).read())
    for realm in realms:
        if realmIsMissing(realm, current_realms):
            createRealm(realm, token)

def readFlowsFromFile(realm):
    with open("/tmp/keycloak/import/update/" + realm + "-realm.json") as import_file:
        import_data = json.load(import_file)
        return import_data["authenticationFlows"]

def readConfigsFromFile(realm):
    with open("/tmp/keycloak/import/update/" + realm + "-realm.json") as import_file:
        import_data = json.load(import_file)
        return import_data["authenticatorConfig"]

def getFlowsFromKeycloak(realm, token):
    url = "/auth/admin/realms/" + realm + "/authentication/flows"
    headers = {"Accept": "application/json", "Authorization": "Bearer " + token, "Content-Type": "application/json;charset=UTF-8"}
    return json.loads(doHttpRequest("GET", url, "", headers).read())

def getCorrespondingFlowFromList(flow_alias, flow_list):
    for flow in flow_list:
        if flow_alias == flow["alias"]:
            return flow
    return None

def createTopLevelFlow(realm, token, flow):
    url = "/auth/admin/realms/" + realm + "/authentication/flows"
    headers = {"Accept": "application/json", "Authorization": "Bearer " + token, "Content-Type": "application/json;charset=UTF-8"}
    data = json.dumps({"alias": flow["alias"], "builtIn": False, "description": flow["description"], "providerId": flow["providerId"], "topLevel": True})
    doHttpRequest("POST", url, data, headers)
    return;

def createExecution(realm, token, flow_alias, execution):
    url = "/auth/admin/realms/" + realm + "/authentication/flows/" + flow_alias + "/executions/execution"
    headers = {"Accept": "application/json", "Authorization": "Bearer " + token, "Content-Type": "application/json;charset=UTF-8"}
    data = json.dumps({"provider": execution["authenticator"]})
    doHttpRequest("POST", url, data, headers)
    return;

def createExecutionFlow(realm, token, top_flow_alias, execution_flow, flow):
    url = "/auth/admin/realms/" + realm + "/authentication/flows/" + top_flow_alias + "/executions/flow"
    headers = {"Accept": "application/json", "Authorization": "Bearer " + token, "Content-Type": "application/json;charset=UTF-8"}
    create_data = json.dumps({"alias": execution_flow["flowAlias"], "type": flow["providerId"], "description": flow["description"], "provider": execution_flow["authenticator"]})
    doHttpRequest("POST", url, create_data, headers)

    for execution in flow["authenticationExecutions"]:
        createExecution(realm, token, flow["alias"], execution)

    return;

def createMissingFlowsAndExecutions(realm, token, import_flows, current_flows):
    for flow in import_flows:
        if flow["topLevel"]:
            corresponding = getCorrespondingFlowFromList(flow["alias"], current_flows)
            if corresponding == None:
                createTopLevelFlow(realm, token, flow)
                for execution in flow["authenticationExecutions"]:
                    if execution["autheticatorFlow"]:
                        corresponding_current = getCorrespondingFlowFromList(execution["flowAlias"], current_flows)
                        if corresponding == None:
                            createExecutionFlow(realm, token, flow["alias"], execution, getCorrespondingFlowFromList(execution["flowAlias"], import_flows))
                    else:
                        createExecution(realm, token, flow["alias"], execution)

access_token = getAccessToken()

createRealmsIfMissing(["fdk-local"], access_token)

fdk_local_import_flows = readFlowsFromFile("fdk-local")

fdk_local_current_flows = getFlowsFromKeycloak("fdk-local", access_token)

createMissingFlowsAndExecutions("fdk-local", access_token, fdk_local_import_flows, fdk_local_current_flows)

def getExecutions(realm, flow_alias, token):
    url = "/auth/admin/realms/" + realm + "/authentication/flows/" + flow_alias + "/executions"
    headers = {"Accept": "application/json", "Authorization": "Bearer " + token, "Content-Type": "application/json;charset=UTF-8"}
    return json.loads(doHttpRequest("GET", url, "", headers).read())

def getCorrespondingExecutionFromList(imported, execution_list):
    if imported["autheticatorFlow"]:
        for execution in execution_list:
            if imported["flowAlias"] == execution["displayName"]:
                return execution
    else:
        for execution in execution_list:
            if imported["authenticator"] == execution["providerId"]:
                return execution
    return None

def getCorrespondingConfigFromList(config_name, config_list):
    for config in config_list:
        if config_name == config["alias"]:
            return config
    return None

def updateExecutionValues(imported_values, to_update):
    if objectHasAttribute(imported_values, "flowAlias"):
        to_update["displayName"] = imported_values["flowAlias"]
    if objectHasAttribute(imported_values, "authenticator"):
        to_update["providerId"] = imported_values["authenticator"]
    to_update["authenticationFlow"] = imported_values["autheticatorFlow"]
    to_update["requirement"] = imported_values["requirement"]
    return to_update

def saveExecution(realm, flow_alias, token, execution):
    data = json.dumps(execution)
    url = "/auth/admin/realms/" + realm + "/authentication/flows/" + flow_alias + "/executions"
    headers = {"Accept": "application/json", "Authorization": "Bearer " + token, "Content-Type": "application/json;charset=UTF-8"}
    doHttpRequest("PUT", url, data, headers)
    return;

def updateConfig(realm, config_id, token, import_values):
    url = "/auth/admin/realms/" + realm + "/authentication/config/" + config_id
    headers = {"Accept": "application/json", "Authorization": "Bearer " + token, "Content-Type": "application/json;charset=UTF-8"}
    data = json.dumps({'id': config_id, 'alias': import_values['alias'], 'config': import_values['config']})
    doHttpRequest("PUT", url, data, headers)
    return;

def createConfig(realm, execution_id, token, import_values):
    url = "/auth/admin/realms/" + realm + "/authentication/executions/" + execution_id + "/config"
    headers = {"Accept": "application/json", "Authorization": "Bearer " + token, "Content-Type": "application/json;charset=UTF-8"}
    data = json.dumps({'alias': import_values['alias'], 'config': import_values['config']})
    doHttpRequest("POST", url, data, headers)
    return;

def updateExecutions(realm, token, import_flows):
    realm_configs = readConfigsFromFile(realm) 
    for flow in import_flows:
        current_executions = getExecutions(realm, flow['alias'], token)
        for execution in flow['authenticationExecutions']:
            execution_to_update = getCorrespondingExecutionFromList(execution, current_executions)
            to_save = updateExecutionValues(execution, execution_to_update)
            saveExecution(realm, flow['alias'], token, to_save)
            if objectHasAttribute(execution, 'authenticatorConfig'):
                config_to_import = getCorrespondingConfigFromList(execution['authenticatorConfig'], realm_configs)
                if objectHasAttribute(execution_to_update, 'authenticationConfig'):
                    updateConfig(realm, execution_to_update['authenticationConfig'], token, config_to_import)
                else:
                    createConfig(realm, execution_to_update['id'], token, config_to_import)

updateExecutions("fdk-local", access_token, fdk_local_import_flows)
