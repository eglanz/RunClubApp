'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('mailer', ['core', 'core.admin']);
ApplicationConfiguration.registerModule('mailer.routes', ['core.admin.routes']);
