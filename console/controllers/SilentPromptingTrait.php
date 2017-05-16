<?php

namespace console\controllers;
/**
 * A trait to add silent prompts to Yii2 Console Controller
 * Requires bash shell
 */
trait SilentPromptingTrait {
    /**
     * @see http://www.dzone.com/snippets/password-prompt-php
     * Interactively prompts for input without echoing to the terminal.
     * Requires a bash shell and won't work with safe_mode settings (Uses `shell_exec`)
     * @param string $prompt
     * @return string the user input
     */
    public function promptSilent($prompt) {
        $command = "/usr/bin/env bash -c 'echo OK'";
        if (rtrim(shell_exec($command)) !== 'OK') {
            trigger_error("Can't invoke bash");
            return;
        }
        $command = "/usr/bin/env bash -c 'read -s -p \"" . addslashes($prompt) . "\" value && echo \$value'";
        $value = rtrim(shell_exec($command));
        echo "\n";
        return $value;
    }
}
