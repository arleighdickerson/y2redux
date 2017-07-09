<?php


use console\modules\audio\transport\TransportProvider;
use Thruway\ClientSession;
use Thruway\Peer\Client;
use Thruway\Peer\Router;
use WampPost\WampPost;

return call_user_func(function () {
    $_sessions = new SplObjectStorage();
    $router = new Router(loop());
    loop()->futureTick(function () use ($router) {
        $router->start(false);
    });

    $transport = new TransportProvider();
    $router->addTransportProvider($transport);

    foreach ([new Client("ctl", loop()), new WampPost("wp", loop())] as $client) {
        /** @var Client $client */
        $client->on('open', function (ClientSession $session, $transport, $details) use ($_sessions) {
            $getUsernames = function () use ($_sessions) {
                $usernames = [];
                foreach ($_sessions as $session) {
                    $usernames[] = $_sessions->offsetGet($session);
                }
                return $usernames;
            };
            $session->register('audio.usernames.get', $getUsernames);
            $session->register('audio.usernames.register', function ($args) use ($session, $_sessions, $getUsernames) {
                $_sessions->offsetSet($session, ArrayHelper::getValue($args, 0));
                $usernames = $getUsernames();
                $session->publish('audio.usernames.get', $usernames);
            });
        });
        $client->on('close', function ($session) use ($_sessions) {
            $_sessions->detach($session);
        });
        $router->addInternalClient($client);
    };

    return $transport;
});
