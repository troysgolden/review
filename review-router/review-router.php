<?php
/**
 * Plugin Name: Review Router
 * Description: Review routing component for WordPress via shortcode.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

require_once plugin_dir_path(__FILE__) . 'includes/ajax-handler.php';

function rr_enqueue_scripts() {
    wp_enqueue_style(
        'review-router-css',
        plugin_dir_url(__FILE__) . 'assets/style.css',
        [],
        '1.0.0'
    );

    wp_enqueue_script(
        'review-router-js',
        plugin_dir_url(__FILE__) . 'assets/app.js',
        [],
        '1.0.0',
        true
    );

    wp_localize_script('review-router-js', 'rr_ajax', [
        'ajax_url' => admin_url('admin-ajax.php'),
    ]);
}

function rr_shortcode() {
    rr_enqueue_scripts();
    return '<div id="review-router-root"></div>';
}
add_shortcode('review_router', 'rr_shortcode');