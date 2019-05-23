<?php
    function autoload($className) {
        global $_PATH;
        if (!class_exists($className, false)) {
            foreach ($_PATH as $k => $path) {
                if (file_exists($_PATH['sys']. '/' . $className . '.php')) {
                    require_once('sys/' . $className . '.php');
                    break;
                }
            }
        }
    }
    spl_autoload_register('autoload');