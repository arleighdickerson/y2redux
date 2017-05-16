<?php

return [
    '' => 'site/index',
    '<action:(about|login|contact|counter)>' => 'site/<action>',
    'api/<action>' => 'api/default/<action>',
    'api/<controller>/<action>' => 'api/<controller>/<action>',
];
