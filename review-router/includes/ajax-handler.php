<?php

if (!defined('ABSPATH')) exit;

add_action('wp_ajax_submit_feedback', 'rr_handle_feedback');
add_action('wp_ajax_nopriv_submit_feedback', 'rr_handle_feedback');

function rr_handle_feedback() {
    $data = json_decode(file_get_contents('php://input'), true);

    $rating   = isset($data['rating']) ? sanitize_text_field($data['rating']) : '';
    $comment  = isset($data['comment']) ? sanitize_textarea_field($data['comment']) : '';
    $name     = isset($data['name']) ? sanitize_text_field($data['name']) : '';
    $email    = isset($data['email']) ? sanitize_email($data['email']) : '';
    $client   = isset($data['client']) ? sanitize_text_field($data['client']) : '';
    $campaign = isset($data['campaign']) ? sanitize_text_field($data['campaign']) : '';

    $admin_email = get_option('admin_email');

    $subject = "New {$rating}-Star Feedback";

    $message = "Rating: {$rating}\n\n";
    $message .= "Comment: {$comment}\n\n";
    $message .= "Name: {$name}\n";
    $message .= "Email: {$email}\n";
    $message .= "Client: {$client}\n";
    $message .= "Campaign: {$campaign}\n";

    wp_mail($admin_email, $subject, $message);

    wp_send_json_success([
        'message' => 'Feedback received'
    ]);
}