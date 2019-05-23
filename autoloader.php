<?php
    function autoload($className) {
        if (!class_exists($className, false)) {
            foreach ($_APP_PATH as $k => $path) {
                if (file_exists(__DIR__ . '/' . $className . '.php')) {
                    require_once(__DIR__ . '/' . $className . '.php');
                    break;
                }
            }
        }
    }
    
    spl_autoload_register('autoload');