const rest = require('./rest-helper');
const config = require('../config/config');
const assert = require('assert');

const createJiraSession = async function createJiraSession (jiraUser, jiraPassword) {
  const sessionPayload = {
    username: jiraUser,
    password: jiraPassword
  };

  const response = await rest.POSTRequestWrapper(
    createJiraSession.name,
    config.JIRA_CONFIG.JIRA_URI,
    config.JIRA_CONFIG.JIRA_ISSUE_AUTH_SESSION_ENDPOINT,
    config.REST_CONFIG.HEADER_ACCEPT_APPLICATION_JSON,
    '',
    sessionPayload
  );

  assert.strictEqual(response.statusCode, 200, `Response code is ${response.statusCode} and not 200`);

  return JSON.parse(response.body).session;
};

const createJiraSessionHeaders = (sessionPayload) => {
  const authHeaderValue = `${sessionPayload.name}=${sessionPayload.value}`;

  return authHeaderValue;
};

const createJiraIssue = async function (authHeaders, filePayload) {
  const issueRequestPayload = JSON.parse(filePayload);
  const response = await rest.POSTRequestWrapper(
    createJiraIssue.name,
    config.JIRA_CONFIG.JIRA_URI,
    config.JIRA_CONFIG.JIRA_ISSUE_CREATION_ENDPOINT,
    config.REST_CONFIG.HEADER_ACCEPT_APPLICATION_JSON,
    authHeaders,
    issueRequestPayload
  );

  return response;
};

const searchExistingJiraIssues = async function (authHeaders) {
  const response = await rest.POSTRequestWrapper(
    searchExistingJiraIssues.name,
    config.JIRA_CONFIG.JIRA_URI,
    config.JIRA_CONFIG.JIRA_ISSUE_SEARCH_ENDPOINT,
    config.REST_CONFIG.HEADER_ACCEPT_APPLICATION_JSON,
    authHeaders,
    config.JIRA_CONFIG.JIRA_ISSUE_SEARCH_PAYLOAD
  );

  return response.body;
};

const invalidateJiraSession = async function (authHeaders) {
  const response = await rest.DELETERequestWrapper(
    invalidateJiraSession.name,
    config.JIRA_CONFIG.JIRA_URI,
    config.JIRA_CONFIG.JIRA_ISSUE_AUTH_SESSION_ENDPOINT,
    config.REST_CONFIG.HEADER_ACCEPT_APPLICATION_JSON,
    authHeaders
  );

  assert.strictEqual(response.statusCode, 204, `Response code is ${response.statusCode} and not 204`);

  return response.body;
};

module.exports = {
  createJiraIssue: createJiraIssue,
  createJiraSession: createJiraSession,
  createJiraSessionHeaders: createJiraSessionHeaders,
  searchExistingJiraIssues: searchExistingJiraIssues,
  invalidateJiraSession: invalidateJiraSession
};
