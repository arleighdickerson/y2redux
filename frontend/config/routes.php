<?php

$manager
    ->addRoute('', function () {
        view()->title = 'Arleigh Dickerson';
    })
    ->addRoute('contact', function () {
        view()->title = 'Contact Me';
    })
    ->addRoute('skill/<name>', function ($name = null) {
        view()->title = $name === null ? 'Skills Index' : $name;
    })
    ->addRoute('progs/<name>', function ($name = null) {
        view()->title = $name === null ? 'Progs Index' : $name;
    });
