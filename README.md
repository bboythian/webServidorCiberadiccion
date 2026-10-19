# Research Usage Reports — Node.js Backend Prototype

**Node.js · Express · MongoDB · Mongoose**

## Overview

A server-side research prototype for receiving and managing **mobile app-usage reports**. The code defines report fields for an identifier, report date, predominant usage, application names, and foreground usage times.

This repository appears related to university research into device-use patterns and cyberaddiction. Its publication rights have not been confirmed.

## Code Reviewed

The application entry point is `app.js`, which includes:

- Express form-data handling.
- A Mongoose schema and MongoDB persistence for usage reports.
- A `POST /enviar-datos` endpoint for reports submitted from the mobile app.
- A `POST /add-reporte` endpoint for HTML form submissions.
- A `POST /delete-reporte` endpoint.
- A `GET /get-reportes` endpoint that returns stored reports as JSON.

## Privacy and Security

**Research prototype only — do not use with real participant data or expose to the public Internet.** The current code does not show authentication or authorization protecting report retrieval and deletion. Because reports may include personal identifiers and device-usage data, a production service would need access controls, input validation, consent and retention policies, and appropriate data protection.

The root route refers to a `web.html` file; availability and runtime behavior have not been verified. A successful local deployment is not claimed.

## Development Notes

Review `package.json` for dependencies and configure a private local MongoDB instance before experimenting with synthetic data. The code currently references a local MongoDB connection.

## Portfolio-Safe Summary

> Developed an Express/MongoDB backend prototype for collecting and managing mobile application-usage reports in a university research context.

A sanitized, permission-approved case study is preferable to publicly showcasing research infrastructure or data.

**Status:** Research prototype; security, privacy, and academic publication review required.
