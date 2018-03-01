<?php
/*
Plugin Name: Rabbit mq test
Plugin URI:
Description:
Author: Peter Sharp
Version: 1.6
Author URI: http://ma.tt/
*/
namespace RabbitMqTest;

require_once __DIR__ . '/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class PostSteamer {

  private $conn;

  private $channel;

  function __construct($conn) {
      $this->conn = $conn;

      $this->channel = $this->conn->channel();
  }

  function update($postID) {
    $post = get_post($postID);
    if('revision' == $post->post_type) return;
    $this->channel->queue_declare('post_updates', false, false, false, false);

    $msg = new AMQPMessage(json_encode($post, JSON_PRETTY_PRINT));
    $this->channel->basic_publish($msg, '', 'post_updates');
  }

  function __destruct() {
    $this->channel->close();

    $this->conn->close();
  }

  static function instance() {
    static $instance = null;
    if(!$instance) {
      $instance = new self(new AMQPStreamConnection('localhost', 5672, 'guest', 'guest'));
    }
    return $instance;
  }
}


add_action('save_post', [PostSteamer::instance(), 'update']);
