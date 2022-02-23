'use strict';

/**
 * distance-travelled service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::distance-travelled.distance-travelled');
