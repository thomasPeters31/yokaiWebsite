<?php
// Contact form handler using PHPMailer + Outlook SMTP
// Show all PHP errors
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Load Composer autoload
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Load .env
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Sanitize inputs
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        exit("<script>alert('Invalid email address.'); window.location.href='contactPage.html';</script>");
    }

    $mail = new PHPMailer(true);

    
    // Debug settings
    
    $mail->SMTPDebug = 3;          // 3 = full debug output
    $mail->Debugoutput = 'html';   // prints debug to browser

    try {
        // SMTP settings for Outlook personal account
        $mail->isSMTP();
        $mail->Host       = 'smtp.office365.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['OUTLOOK_EMAIL'];
        $mail->Password   = $_ENV['OUTLOOK_PASSWORD']; // app password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom($_ENV['OUTLOOK_EMAIL'], 'Yokaie Esports');
        $mail->addAddress($_ENV['OUTLOOK_EMAIL']);      // receive email
        $mail->addReplyTo($email, $name);               // reply to sender

        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Contact Form Submission from $name";
        $mail->Body    = "
            <h2>Contact Form Submission</h2>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Message:</strong><br>$message</p>
        ";
        $mail->AltBody = "Name: $name\nEmail: $email\nMessage:\n$message";

        // Send
        $mail->send();

        echo "<script>alert('Message sent successfully!'); window.location.href='contactPage.html';</script>";

    } catch (Exception $e) {
        // Display debug output first
        echo "<pre>";
        echo "PHPMailer Error: {$mail->ErrorInfo}\n\n";
        echo "</pre>";

        // Alert user
        echo "<script>alert('Error sending message. Check debug output above.');</script>";
    }

} else {
    header("Location: contactPage.html");
    exit;
}
