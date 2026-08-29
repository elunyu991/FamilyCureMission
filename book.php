<?php
$servername = "sql213.infinityfree.com";
$username   = "if0_42136708";
$password   = "Aar@ne1unyu";
$dbname     = "if0_42136708_epiz_12345678_appointments"; // ✅ no .db at the end

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    exit("Database connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $first_name     = $_POST['firstName'];
    $last_name      = $_POST['lastName'];
    $email          = $_POST['email'];
    $phone          = $_POST['phone'];
    $service_needed = $_POST['service'];
    $date           = $_POST['preferredDate'];
    $time           = $_POST['preferredTime'];
    $type           = $_POST['appointmentType'];
    $info           = $_POST['message'];

    $sql = "INSERT INTO appointments 
            (first_name, last_name, email, phone, service_needed, preferred_date, preferred_time, appointment_type, additional_info)
            VALUES ('$first_name', '$last_name', '$email', '$phone', '$service_needed', '$date', '$time', '$type', '$info')";

    if ($conn->query($sql) === TRUE) {
        echo "success";
    } else {
        http_response_code(500);
        echo "Error: " . $conn->error;
    }
}

$conn->close();
?>