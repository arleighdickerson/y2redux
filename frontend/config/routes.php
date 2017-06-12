<?php
use frontend\components\RouteManager;

/** @var RouteManager $manager */
/*
'' => 'default/index',
    '<action:(contact)>' => 'default/<action>',
    'error' => 'default/error',
    'skills' => 'default/skill',
    'skills/<name>' => 'default/skill',
    'progs' => 'default/prog',
    'progs/<name>' => 'default/prog',
    'api/<action:(contact)>' => 'api/default/<action>',
*/
$manager
    ->addRoute('', function () {
    })
    ->addRoute('', function () {
        view()->title = 'Arleigh Dickerson';
    })
    ->addRoute('', function () {
        view()->title = 'Contact Me';
    })
    ->addRoute('skill', function ($name = null) {
        view()->title = $name === null ? 'Skills Index' : $name;
    })
    ->addRoute('prog', function ($name = null) {
        view()->title = $name === null ? 'Progs Index' : $name;
    });
