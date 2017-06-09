<?php
namespace common\components;

use yii\base\Component;
use yii\base\Event;
use yii\base\Exception;
use yii\base\NotSupportedException;
use yii\helpers\VarDumper;

class Dispatcher extends Component {
    private $_callbacks = [];
    private $_isDispatching = false;
    private $_isHandled = [];
    private $_isPending = [];
    private $_lastId = 0;
    private $_pendingPayload;

    /**
     * @param $payload
     * @return void
     */
    public function __invoke($payload) {
        $this->dispatch($payload);
    }

    /**
     * @param string $name
     * @param Event|null $event
     *
     * an alias for dispatch
     */
    public function trigger($name, Event $event = null) {
        $this->ensureBehaviors();
        if ($event === null) {
            $event = new Event;
        }
        if ($event->sender === null) {
            $event->sender = $this;
        }
        $this->dispatch($event);
    }

    public function on($name, $handler, $data = null, $append = true) {
        throw new NotSupportedException(__METHOD__ . ' is not supported');
    }

    /**
     * @param callable $callback
     * @return string
     */
    public function register(callable $callback) {
        $id = $this->_lastId++;
        $this->_callbacks[$id] = $callback;
        return $id;
    }

    /**
     * @param string $id
     * @return void
     */
    public function unregister($id) {
        $id = $this->resolveKey($id);
        $this->assert(isset($this->_callbacks[$id]),
            'Dispatcher.unregister(...): {} does not map to a registered callback.',
            $id
        );
        unset($this->_callbacks[$id]);
    }

    /**
     * @return void
     */
    public function waitFor() {
        $ids = array_map([$this, 'resolveKey'], func_get_args());
        $this->assert(
            $this->_isDispatching,
            'Dispatcher.waitFor(...): Must be invoked while dispatching.',
            $ids
        );
        foreach ($ids as $id) {
            if ($this->_isPending[$id]) {
                $this->assert(
                    isset($this->_isHandled[$id]),
                    'Dispatcher.waitFor(...): Circular dependency detected while waiting for {}',
                    $id
                );
                continue;
            }
            $this->assert(
                isset($this->_callbacks[$id]),
                'Dispatcher.waitFor(...): {} does not map to a registered callback.',
                $id
            );
            $this->invokeCallback($id);
        }
    }

    /**
     * @param $payload
     * @return void
     */
    public function dispatch($payload) {
        $this->assert(
            !$this->_isDispatching,
            'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
        );
        $this->startDispatching($payload);
        try {
            foreach ($this->_callbacks as $id => $callback) {
                if (!$this->_isPending[$id]) {
                    $this->invokeCallback($id);
                }
            }
        } finally {
            $this->stopDispatching();
        }
    }

    /**
     * @return boolean
     */
    public function getIsDispatching() {
        return $this->_isDispatching;
    }

    private function invokeCallback($id) {
        $id = $this->resolveKey($id);
        $this->_isPending[$id] = true;
        call_user_func($this->_callbacks[$id], $this->_pendingPayload);
        $this->_isHandled[$id] = true;
    }

    private function startDispatching($payload) {
        foreach ($this->_callbacks as $id => $callback) {
            $this->_isPending[$id] = false;
            $this->_isHandled[$id] = false;
        }
        $this->_pendingPayload = $payload;
        $this->_isDispatching = true;
    }

    private function stopDispatching() {
        $this->_pendingPayload = null;
        $this->_isDispatching = false;
    }

    private function assert($truthy, $message, $value = '') {
        if (!$truthy) {
            throw new Exception(str_replace('{}', VarDumper::dumpAsString($value), $message));
        }
    }

    private function resolveKey($callableOrId) {
        if (is_callable($callableOrId)) {
            if (($key = array_search($callableOrId, $this->_callbacks)) !== false) {
                return $key;
            }
        }
        return $callableOrId;
    }
}

