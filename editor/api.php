<?php
if (!isset($_POST['type'])) return;
    
require "../../dayside/server/api.php";

class RuhohApi extends FileApi {
    function __construct() {
        $password = "123";
        $salt = "boo";
        
        if (isset($_POST['password']))
            setcookie('editor_auth',$test = md5($_POST['password'].$salt),0,'/');
        else
            $test = $_COOKIE['editor_auth'];
        
        if ($test!=md5($password.$salt)) { echo "auth_error"; die(); } 
        $this->{$_POST['type']}();
        die();                
    }
    
    function _pathFromUrl($url) {
        $url = explode('/',$url,4);
        $url = @$url[3] ? "/".$url[3] : "";
        
        $base = substr($_SERVER['REQUEST_URI'],0,strlen($_SERVER['REQUEST_URI'])-strlen($_SERVER['QUERY_STRING']));
        $base = preg_replace('/(\/)?('.basename(__FILE__).')?\??$/i','',$base);
        $base = implode('/',explode('/',$base,-2));
        
        if ($base=="" || strpos($url,$base)===0) {
            $rel = substr($url,strlen($base));
            $path = realpath(__DIR__."/../..").$rel;
            return $path;
        }
        return false;
    }
    
    function batch() {
        $res = array();
        $url = $_POST['path'];
        $path = $this->_pathFromUrl($url);
        
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($path,\RecursiveDirectoryIterator::SKIP_DOTS),\RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($iterator as $sub) {
            $sub_path = $sub->__toString();
            $sub_url = str_replace($path,$url,$sub_path);
            if ($sub->isDir()) {
                $res[$sub_url] = array('directory'=>true);
            } else {
                $res[$sub_url] = array('content'=>file_get_contents($sub_path));
            }
        }
        echo json_encode($res);
    }
}

$api = new RuhohApi;