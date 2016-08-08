/*globals sap*/

sap.ui.define(
    [
        'sap/ui/base/Object',
        'sap/ui/core/IconPool'
    ],

    function (Object, IconPool) {
        'use strict';

        var Manager = Object.extend('nrg.base.component.IconManager', {
            metadata: {
                publicMethods: [
                    'addIcons'
                ]
            }
        });


        Manager.prototype.addIcons = function () {
            IconPool.addIcon('agent', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e600'
            });

            IconPool.addIcon('billing', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e601'
            });

            IconPool.addIcon('bp', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e602'
            });

            IconPool.addIcon('bulb', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e603'
            });

            IconPool.addIcon('calculator', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e604'
            });

            IconPool.addIcon('call-center', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e605'
            });

            IconPool.addIcon('campaign', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e606'
            });

            IconPool.addIcon('cc-amex', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e607'
            });

            IconPool.addIcon('cc-discover', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e608'
            });

            IconPool.addIcon('cc-mastercard', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e609'
            });

            IconPool.addIcon('cc-visa', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e60a'
            });

            IconPool.addIcon('contact-log', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e60b'
            });

            IconPool.addIcon('dashboard', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e60c'
            });

            IconPool.addIcon('description', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e60d'
            });

            IconPool.addIcon('dollar', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e60e'
            });

            IconPool.addIcon('enroll-biz', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e60f'
            });

            IconPool.addIcon('enroll-res', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e610'
            });

            IconPool.addIcon('gear', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e611'
            });

            IconPool.addIcon('high-bill', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e612'
            });

            IconPool.addIcon('history', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e613'
            });

            IconPool.addIcon('location', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e614'
            });

            IconPool.addIcon('notes', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e615'
            });

            IconPool.addIcon('notification', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e616'
            });

            IconPool.addIcon('pencil', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e617'
            });

            IconPool.addIcon('plus', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e618'
            });

            IconPool.addIcon('refresh', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e619'
            });

            IconPool.addIcon('rhs', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e61a'
            });

            IconPool.addIcon('service-order', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e61b'
            });

            IconPool.addIcon('survey', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e61c'
            });

            IconPool.addIcon('tag', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e61d'
            });

            IconPool.addIcon('weather-cloud', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e61e'
            });

            IconPool.addIcon('weather-rain', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e61f'
            });

            IconPool.addIcon('weather-rain-sun', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e620'
            });

            IconPool.addIcon('weather-snow', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e621'
            });

            IconPool.addIcon('weather-sunny', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e622'
            });

            IconPool.addIcon('webchat', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e623'
            });

            IconPool.addIcon('website', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e624'
            });

            IconPool.addIcon('person', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e625'
            });


            IconPool.addIcon('handset', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e627'
            });

            IconPool.addIcon('calendar', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e628'
            });

            IconPool.addIcon('verified', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e629'
            });

            IconPool.addIcon('trashcan', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e62a'
            });

            IconPool.addIcon('search', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e62b'
            });

            IconPool.addIcon('ivr', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e62c'
            });

            IconPool.addIcon('not-verified', 'ute-icon', {
                fontFamily: 'ute-icon',
                content: 'e62d'
            });
        };

        return Manager;
    }
);
