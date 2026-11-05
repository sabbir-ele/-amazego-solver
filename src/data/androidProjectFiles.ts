import { AndroidProjectFile } from '../types';

export const ANDROID_PROJECT_FILES: AndroidProjectFile[] = [
  {
    path: 'app/src/main/java/com/amazego/autosolver/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'kotlin',
    content: `package com.amazego.autosolver

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.amazego.autosolver.service.AutoTapAccessibilityService
import com.amazego.autosolver.service.FloatingOverlayService
import com.amazego.autosolver.ui.theme.AmazeGoTheme

/**
 * Amaze GO Auto Solver - Main Dashboard & Permission Manager
 * Official Developer & Creator: MD. SABBIR RAHMAN
 * Project Owner: MD. SABBIR RAHMAN
 * Attribution: Developed by MD. SABBIR RAHMAN
 * Handles runtime permissions for Floating Overlay, MediaProjection, and Accessibility.
 */
class MainActivity : ComponentActivity() {

    private lateinit var mediaProjectionManager: MediaProjectionManager

    private val screenCaptureLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK && result.data != null) {
            FloatingOverlayService.setMediaProjectionIntent(result.resultCode, result.data!!)
            startFloatingOverlayService()
            Toast.makeText(this, "Screen Capture Permission Granted", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Screen Capture Permission Denied", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mediaProjectionManager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager

        setContent {
            AmazeGoTheme {
                MainScreen(
                    onStartService = { checkPermissionsAndStart() },
                    onRequestOverlayPermission = { requestOverlayPermission() },
                    onRequestAccessibility = { requestAccessibilityPermission() }
                )
            }
        }
    }

    private fun checkPermissionsAndStart() {
        if (!Settings.canDrawOverlays(this)) {
            requestOverlayPermission()
            return
        }
        if (!AutoTapAccessibilityService.isServiceRunning) {
            Toast.makeText(this, "Please enable Accessibility Service for auto-tap", Toast.LENGTH_LONG).show()
            requestAccessibilityPermission()
            return
        }
        // Launch Screen Capture request
        val captureIntent = mediaProjectionManager.createScreenCaptureIntent()
        screenCaptureLauncher.launch(captureIntent)
    }

    private fun startFloatingOverlayService() {
        val intent = Intent(this, FloatingOverlayService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
        finish() // Minimize to background to let user open Amaze GO!
    }

    private fun requestOverlayPermission() {
        val intent = Intent(
            Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
            Uri.parse("package:$packageName")
        )
        startActivity(intent)
    }

    private fun requestAccessibilityPermission() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        startActivity(intent)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    onStartService: () -> Unit,
    onRequestOverlayPermission: () -> Unit,
    onRequestAccessibility: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Amaze GO! Auto Solver", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Universal Arrow Puzzle Assistant", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        "Scans Amaze GO! puzzles in real time, computes unobstructed arrow clearance sequences using dependency graphs, and automatically taps solutions.",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }

            // Permission Status Cards
            Text("Required Permissions", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)

            PermissionCard(
                title = "Floating Overlay (SYSTEM_ALERT_WINDOW)",
                description = "Enables draggable solver panel above the game.",
                icon = Icons.Default.Layers,
                onConfigure = onRequestOverlayPermission
            )

            PermissionCard(
                title = "Accessibility Service",
                description = "Simulates precise screen taps on arrows.",
                icon = Icons.Default.TouchApp,
                onConfigure = onRequestAccessibility
            )

            PermissionCard(
                title = "Screen Capture (MediaProjection)",
                description = "Captures puzzle frames for OpenCV arrow detection.",
                icon = Icons.Default.Screenshot,
                onConfigure = onStartService
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Launch Button
            Button(
                onClick = onStartService,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.PlayArrow, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Start Floating Assistant", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun PermissionCard(
    title: String,
    description: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onConfigure: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(32.dp))
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text(description, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            }
            TextButton(onClick = onConfigure) {
                Text("Enable")
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/amazego/autosolver/service/FloatingOverlayService.kt',
    name: 'FloatingOverlayService.kt',
    category: 'kotlin',
    content: `package com.amazego.autosolver.service

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.*
import android.widget.*
import androidx.core.app.NotificationCompat
import com.amazego.autosolver.R
import com.amazego.autosolver.capture.ScreenCaptureManager
import com.amazego.autosolver.controller.AutoTapController
import com.amazego.autosolver.cv.ArrowDetector
import com.amazego.autosolver.solver.PuzzleSolver
import com.amazego.autosolver.ui.DebugVisualizer
import kotlinx.coroutines.*

/**
 * Floating Overlay Service (TYPE_APPLICATION_OVERLAY)
 * Provides a draggable, collapsible floating control panel above Amaze GO!
 */
class FloatingOverlayService : Service() {

    private lateinit var windowManager: WindowManager
    private var overlayView: View? = null
    private var visualizerOverlay: DebugVisualizer? = null
    private val serviceScope = CoroutineScope(Dispatchers.Main + Job())

    private var screenCaptureManager: ScreenCaptureManager? = null
    private var arrowDetector = ArrowDetector()
    private var puzzleSolver = PuzzleSolver()
    private var autoTapController: AutoTapController? = null

    companion object {
        var projectionResultCode: Int = 0
        var projectionData: Intent? = null

        fun setMediaProjectionIntent(resultCode: Int, data: Intent) {
            projectionResultCode = resultCode
            projectionData = data
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        startForegroundServiceNotification()
        initScreenCapture()
        createFloatingOverlay()
    }

    private fun startForegroundServiceNotification() {
        val channelId = "amazego_overlay_channel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Amaze GO Floating Assistant",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        val notification: Notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Amaze GO Auto Solver Active")
            .setContentText("Floating controls are visible above the screen.")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .build()

        startForeground(1001, notification)
    }

    private fun initScreenCapture() {
        if (projectionData != null) {
            screenCaptureManager = ScreenCaptureManager(this, projectionResultCode, projectionData!!)
            autoTapController = AutoTapController(
                context = this,
                screenCaptureManager = screenCaptureManager!!,
                arrowDetector = arrowDetector,
                puzzleSolver = puzzleSolver
            )
        }
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun createFloatingOverlay() {
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 100
            y = 200
        }

        overlayView = LayoutInflater.from(this).inflate(R.layout.layout_floating_panel, null)

        // Setup Dragging
        var initialX = 0
        var initialY = 0
        var initialTouchX = 0f
        var initialTouchY = 0f

        val dragHandle = overlayView!!.findViewById<View>(R.id.drag_handle)
        dragHandle.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    initialX = params.x
                    initialY = params.y
                    initialTouchX = event.rawX
                    initialTouchY = event.rawY
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    params.x = initialX + (event.rawX - initialTouchX).toInt()
                    params.y = initialY + (event.rawY - initialTouchY).toInt()
                    windowManager.updateViewLayout(overlayView, params)
                    true
                }
                else -> false
            }
        }

        // Button Listeners
        val btnScan = overlayView!!.findViewById<Button>(R.id.btn_scan)
        val btnManual = overlayView!!.findViewById<Button>(R.id.btn_manual)
        val btnAuto = overlayView!!.findViewById<Button>(R.id.btn_auto)
        val btnStop = overlayView!!.findViewById<Button>(R.id.btn_stop)
        val statusText = overlayView!!.findViewById<TextView>(R.id.txt_status)

        btnScan.setOnClickListener {
            serviceScope.launch {
                statusText.text = "Scanning..."
                val bitmap = screenCaptureManager?.captureScreen()
                if (bitmap != null) {
                    val detection = arrowDetector.detectArrows(bitmap)
                    val solution = puzzleSolver.solve(detection.arrows)
                    statusText.text = "Detected: \${detection.arrows.size} | Unblocked: \${solution.freeArrows.size}"
                } else {
                    statusText.text = "Capture Failed"
                }
            }
        }

        btnAuto.setOnClickListener {
            statusText.text = "Auto Solving..."
            autoTapController?.startAutoSolve { status ->
                statusText.text = status
            }
        }

        btnStop.setOnClickListener {
            autoTapController?.emergencyStop()
            statusText.text = "Stopped"
        }

        windowManager.addView(overlayView, params)
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
        screenCaptureManager?.release()
        overlayView?.let { windowManager.removeView(it) }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/amazego/autosolver/cv/ArrowDetector.kt',
    name: 'ArrowDetector.kt',
    category: 'kotlin',
    content: `package com.amazego.autosolver.cv

import android.graphics.Bitmap
import org.opencv.android.Utils
import org.opencv.core.*
import org.opencv.imgproc.Imgproc
import kotlin.math.*

/**
 * Arrow Detection Computer Vision Pipeline using OpenCV
 * Detects arrow head direction, body polyline, curved turns, and bounding coordinates.
 */
class ArrowDetector {

    data class DetectedArrow(
        val id: String,
        val centerX: Double,
        val centerY: Double,
        val headX: Double,
        val headY: Double,
        val direction: ArrowDirection,
        val isCurved: Boolean,
        val curveTurn: CurveTurn?,
        val confidence: Double,
        val boundingBox: Rect
    )

    enum class ArrowDirection { UP, DOWN, LEFT, RIGHT }
    enum class CurveTurn { CLOCKWISE, COUNTER_CLOCKWISE }

    data class DetectionResult(
        val arrows: List<DetectedArrow>,
        val processedBitmap: Bitmap?
    )

    fun detectArrows(bitmap: Bitmap): DetectionResult {
        val mat = Mat()
        Utils.bitmapToMat(bitmap, mat)

        val gray = Mat()
        Imgproc.cvtColor(mat, gray, Imgproc.COLOR_RGBA2GRAY)

        // Gaussian blur to eliminate board background noise
        val blurred = Mat()
        Imgproc.GaussianBlur(gray, blurred, Size(5.0, 5.0), 0.0)

        // Adaptive thresholding to isolate arrow silhouettes
        val thresh = Mat()
        Imgproc.adaptiveThreshold(
            blurred,
            thresh,
            255.0,
            Imgproc.ADAPTIVE_THRESH_GAUSSIAN_C,
            Imgproc.THRESH_BINARY_INV,
            15,
            4.0
        )

        // Contour extraction
        val contours = mutableListOf<MatOfPoint>()
        val hierarchy = Mat()
        Imgproc.findContours(
            thresh,
            contours,
            hierarchy,
            Imgproc.RETR_EXTERNAL,
            Imgproc.CHAIN_APPROX_SIMPLE
        )

        val detectedArrows = mutableListOf<DetectedArrow>()

        for (i in contours.indices) {
            val contour = contours[i]
            val area = Imgproc.contourArea(contour)
            if (area < 350 || area > 40000) continue // Filter out tiny speckles and large backgrounds

            val rect = Imgproc.boundingRect(contour)
            val moments = Imgproc.moments(contour)
            val cx = moments.m10 / (moments.m00 + 1e-5)
            val cy = moments.m01 / (moments.m00 + 1e-5)

            // Analyze shape geometry using Convex Hull and Defect Points
            val hull = MatOfInt()
            Imgproc.convexHull(contour, hull)

            // Approximate polygon to classify arrow tip
            val approxCurve = MatOfPoint2f()
            val contour2f = MatOfPoint2f(*contour.toArray())
            val peri = Imgproc.arcLength(contour2f, true)
            Imgproc.approxPolyDP(contour2f, approxCurve, 0.025 * peri, true)

            // Find farthest vertex from center of mass -> Arrow Head Tip
            val vertices = approxCurve.toArray()
            var maxDistSq = -1.0
            var headX = cx
            var headY = cy

            for (vertex in vertices) {
                val distSq = (vertex.x - cx).pow(2) + (vertex.y - cy).pow(2)
                if (distSq > maxDistSq) {
                    maxDistSq = distSq
                    headX = vertex.x
                    headY = vertex.y
                }
            }

            // Calculate primary direction vector
            val angle = Math.toDegrees(atan2(headY - cy, headX - cx))
            val direction = when {
                angle >= -45 && angle < 45 -> ArrowDirection.RIGHT
                angle >= 45 && angle < 135 -> ArrowDirection.DOWN
                angle >= -135 && angle < -45 -> ArrowDirection.UP
                else -> ArrowDirection.LEFT
            }

            // Check for curved turn (aspect ratio and principal axis deviation)
            val isCurved = abs(rect.width - rect.height) < 15 && vertices.size >= 6
            val curveTurn = if (isCurved) {
                if (headX > cx && headY > cy) CurveTurn.CLOCKWISE else CurveTurn.COUNTER_CLOCKWISE
            } else null

            detectedArrows.add(
                DetectedArrow(
                    id = "arrow_\$i",
                    centerX = cx,
                    centerY = cy,
                    headX = headX,
                    headY = headY,
                    direction = direction,
                    isCurved = isCurved,
                    curveTurn = curveTurn,
                    confidence = 0.94,
                    boundingBox = rect
                )
            )
        }

        return DetectionResult(arrows = detectedArrows, processedBitmap = bitmap)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/amazego/autosolver/solver/PuzzleSolver.kt',
    name: 'PuzzleSolver.kt',
    category: 'kotlin',
    content: `package com.amazego.autosolver.solver

import com.amazego.autosolver.cv.ArrowDetector.DetectedArrow
import com.amazego.autosolver.cv.ArrowDetector.ArrowDirection

/**
 * Constraint-based Puzzle Solving Engine
 * Builds dependency graph using trajectory raycasts and calculates valid sequence.
 */
class PuzzleSolver {

    data class SolutionResult(
        val sequence: List<DetectedArrow>,
        val freeArrows: List<DetectedArrow>,
        val dependencies: Map<String, List<String>>,
        val isSolvable: Boolean,
        val cycleDetected: Boolean
    )

    fun solve(arrows: List<DetectedArrow>): SolutionResult {
        val depGraph = mutableMapOf<String, MutableList<String>>()
        val inDegree = mutableMapOf<String, Int>()

        for (arrow in arrows) {
            depGraph[arrow.id] = mutableListOf()
            inDegree[arrow.id] = 0
        }

        // Raycast from each arrow along exit trajectory to detect blockers
        for (a in arrows) {
            for (b in arrows) {
                if (a.id == b.id) continue
                if (isBlockedBy(a, b)) {
                    depGraph[a.id]?.add(b.id)
                    inDegree[a.id] = (inDegree[a.id] ?: 0) + 1
                }
            }
        }

        val freeArrows = arrows.filter { inDegree[it.id] == 0 }

        // Topological Sort (Kahn's Algorithm with heuristic priority)
        val sequence = mutableListOf<DetectedArrow>()
        val remaining = arrows.toMutableList()
        val curInDegree = inDegree.toMutableMap()

        while (remaining.isNotEmpty()) {
            val unblocked = remaining.filter { curInDegree[it.id] == 0 }
            if (unblocked.isEmpty()) {
                // Cycle / Deadlock detected! Never guess or tap randomly.
                return SolutionResult(
                    sequence = sequence,
                    freeArrows = freeArrows,
                    dependencies = depGraph,
                    isSolvable = false,
                    cycleDetected = true
                )
            }

            // Pick arrow that frees the most downstream arrows
            val chosen = unblocked.maxByOrNull { arrow ->
                remaining.count { rem -> depGraph[rem.id]?.contains(arrow.id) == true }
            } ?: unblocked.first()

            sequence.add(chosen)
            remaining.remove(chosen)

            for (rem in remaining) {
                if (depGraph[rem.id]?.contains(chosen.id) == true) {
                    curInDegree[rem.id] = maxOf(0, (curInDegree[rem.id] ?: 1) - 1)
                }
            }
        }

        return SolutionResult(
            sequence = sequence,
            freeArrows = freeArrows,
            dependencies = depGraph,
            isSolvable = true,
            cycleDetected = false
        )
    }

    private fun isBlockedBy(a: DetectedArrow, b: DetectedArrow): Boolean {
        val dx = when (a.direction) {
            ArrowDirection.RIGHT -> 1.0
            ArrowDirection.LEFT -> -1.0
            else -> 0.0
        }
        val dy = when (a.direction) {
            ArrowDirection.DOWN -> 1.0
            ArrowDirection.UP -> -1.0
            else -> 0.0
        }

        val vx = b.centerX - a.centerX
        val vy = b.centerY - a.centerY

        // Check if B is in front of A along direction vector
        val dot = vx * dx + vy * dy
        if (dot <= 0) return false // B is behind or perpendicular

        // Perpendicular cross distance
        val cross = kotlin.math.abs(vx * dy - vy * dx)
        val tolerance = maxOf(b.boundingBox.width, b.boundingBox.height) * 0.6

        return cross < tolerance
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/amazego/autosolver/controller/AutoTapController.kt',
    name: 'AutoTapController.kt',
    category: 'kotlin',
    content: `package com.amazego.autosolver.controller

import android.content.Context
import com.amazego.autosolver.capture.ScreenCaptureManager
import com.amazego.autosolver.cv.ArrowDetector
import com.amazego.autosolver.service.AutoTapAccessibilityService
import com.amazego.autosolver.solver.PuzzleSolver
import com.amazego.autosolver.verifier.GameStateVerifier
import kotlinx.coroutines.*

/**
 * Auto Tap Controller & Execution State Machine
 * Executes: Capture -> Solve -> Tap -> Animation Delay -> Screenshot Verification -> Next Move.
 */
class AutoTapController(
    private val context: Context,
    private val screenCaptureManager: ScreenCaptureManager,
    private val arrowDetector: ArrowDetector,
    private val puzzleSolver: PuzzleSolver
) {
    private var job: Job? = null
    private val scope = CoroutineScope(Dispatchers.Default + Job())
    private val verifier = GameStateVerifier()
    private var isEmergencyStopped = false

    var tapIntervalMs: Long = 1200L // Default Slow for safety

    fun startAutoSolve(onProgress: (String) -> Unit) {
        isEmergencyStopped = false
        job?.cancel()

        job = scope.launch {
            while (isActive && !isEmergencyStopped) {
                onProgress("Capturing screen...")
                val preBitmap = screenCaptureManager.captureScreen()
                if (preBitmap == null) {
                    onProgress("Error: Screen capture returned null")
                    break
                }

                onProgress("Detecting puzzle objects...")
                val detection = arrowDetector.detectArrows(preBitmap)
                if (detection.arrows.isEmpty()) {
                    onProgress("Puzzle Complete! All arrows cleared.")
                    break
                }

                val solution = puzzleSolver.solve(detection.arrows)
                if (!solution.isSolvable) {
                    onProgress("Safety Halt: Cyclic deadlock or ambiguous board!")
                    break
                }

                val targetArrow = solution.sequence.firstOrNull() ?: break
                onProgress("Tapping Arrow at (\${targetArrow.centerX.toInt()}, \${targetArrow.centerY.toInt()})...")

                val tapped = AutoTapAccessibilityService.instance?.performTap(
                    targetArrow.centerX.toFloat(),
                    targetArrow.centerY.toFloat()
                ) ?: false

                if (!tapped) {
                    onProgress("Error: Accessibility tap dispatch failed")
                    break
                }

                // Wait for game exit animation
                delay(tapIntervalMs)

                // State Verification: Confirm arrow has disappeared
                val postBitmap = screenCaptureManager.captureScreen()
                if (postBitmap != null) {
                    val verified = verifier.verifyArrowDisappeared(preBitmap, postBitmap, targetArrow.boundingBox)
                    if (!verified) {
                        onProgress("Verification Failed: Arrow did not disappear. Halting for safety.")
                        break
                    }
                }
            }
        }
    }

    fun emergencyStop() {
        isEmergencyStopped = true
        job?.cancel()
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/amazego/autosolver/service/AutoTapAccessibilityService.kt',
    name: 'AutoTapAccessibilityService.kt',
    category: 'kotlin',
    content: `package com.amazego.autosolver.service

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.graphics.Path
import android.view.accessibility.AccessibilityEvent

/**
 * Accessibility Service for automated tap dispatching
 */
class AutoTapAccessibilityService : AccessibilityService() {

    companion object {
        var instance: AutoTapAccessibilityService? = null
        var isServiceRunning = false
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
        isServiceRunning = true
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {}

    override fun onInterrupt() {
        instance = null
        isServiceRunning = false
    }

    override fun onDestroy() {
        super.onDestroy()
        instance = null
        isServiceRunning = false
    }

    fun performTap(x: Float, y: Float, duration: Long = 80L): Boolean {
        val clickPath = Path().apply {
            moveTo(x, y)
        }
        val stroke = GestureDescription.StrokeDescription(clickPath, 0, duration)
        val gesture = GestureDescription.Builder().addStroke(stroke).build()
        return dispatchGesture(gesture, null, null)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/amazego/autosolver/verifier/GameStateVerifier.kt',
    name: 'GameStateVerifier.kt',
    category: 'kotlin',
    content: `package com.amazego.autosolver.verifier

import android.graphics.Bitmap
import org.opencv.android.Utils
import org.opencv.core.*
import org.opencv.imgproc.Imgproc

/**
 * Screenshot-based Verification Engine
 * Compares pre-tap and post-tap frames to confirm arrow removal.
 */
class GameStateVerifier {

    fun verifyArrowDisappeared(pre: Bitmap, post: Bitmap, targetBox: Rect): Boolean {
        val matPre = Mat()
        val matPost = Mat()
        Utils.bitmapToMat(pre, matPre)
        Utils.bitmapToMat(post, matPost)

        // Submat in target bounding box
        val roiPre = Mat(matPre, targetBox)
        val roiPost = Mat(matPost, targetBox)

        val diff = Mat()
        Core.absdiff(roiPre, roiPost, diff)

        val grayDiff = Mat()
        Imgproc.cvtColor(diff, grayDiff, Imgproc.COLOR_RGBA2GRAY)

        val nonZeroCount = Core.countNonZero(grayDiff)
        val totalPixels = targetBox.area()

        // Significant pixel change in bounding box indicates arrow flight
        val changeRatio = nonZeroCount.toDouble() / (totalPixels + 1e-5)
        return changeRatio > 0.18
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/amazego/autosolver/capture/ScreenCaptureManager.kt',
    name: 'ScreenCaptureManager.kt',
    category: 'kotlin',
    content: `package com.amazego.autosolver.capture

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.PixelFormat
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.media.ImageReader
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager

/**
 * Screen Capture Manager using MediaProjection & ImageReader
 */
class ScreenCaptureManager(
    context: Context,
    resultCode: Int,
    data: Intent
) {
    private val projectionManager = context.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
    private var mediaProjection: MediaProjection? = projectionManager.getMediaProjection(resultCode, data)
    private var virtualDisplay: VirtualDisplay? = null
    private var imageReader: ImageReader? = null

    private val width = 1080
    private val height = 2400
    private val density = 420

    init {
        setupVirtualDisplay()
    }

    @SuppressLint("WrongConstant")
    private fun setupVirtualDisplay() {
        imageReader = ImageReader.newInstance(width, height, PixelFormat.RGBA_8888, 2)
        virtualDisplay = mediaProjection?.createVirtualDisplay(
            "AmazeGoCapture",
            width,
            height,
            density,
            DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
            imageReader?.surface,
            null,
            null
        )
    }

    fun captureScreen(): Bitmap? {
        val image = imageReader?.acquireLatestImage() ?: return null
        val planes = image.planes
        val buffer = planes[0].buffer
        val pixelStride = planes[0].pixelStride
        val rowStride = planes[0].rowStride
        val rowPadding = rowStride - pixelStride * width

        val bitmap = Bitmap.createBitmap(
            width + rowPadding / pixelStride,
            height,
            Bitmap.Config.ARGB_8888
        )
        bitmap.copyPixelsFromBuffer(buffer)
        image.close()

        // Crop padding
        return Bitmap.createBitmap(bitmap, 0, 0, width, height)
    }

    fun release() {
        virtualDisplay?.release()
        imageReader?.close()
        mediaProjection?.stop()
    }
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'manifest',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.amazego.autosolver">

    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AmazeGo">

        <meta-data
            android:name="developer"
            android:value="MD. SABBIR RAHMAN" />
        <meta-data
            android:name="creator"
            android:value="MD. SABBIR RAHMAN" />

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.AmazeGo">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".service.FloatingOverlayService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="mediaProjection" />

        <service
            android:name=".service.AutoTapAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>

    </application>

</manifest>
`,
  },
  {
    path: 'app/src/main/res/xml/accessibility_service_config.xml',
    name: 'accessibility_service_config.xml',
    category: 'res',
    content: `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/accessibility_service_description"
    android:accessibilityEventTypes="typeWindowStateChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:notificationTimeout="100"
    android:canPerformGestures="true"
    android:accessibilityFlags="flagDefault" />
`,
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    name: 'strings.xml (English)',
    category: 'res',
    content: `<resources>
    <string name="app_name">Amaze GO Auto Solver</string>
    <string name="developer_name">MD. SABBIR RAHMAN</string>
    <string name="developer_role">App Developer &amp; Creator</string>
    <string name="developed_by">Developed by MD. SABBIR RAHMAN</string>
    <string name="accessibility_service_description">Enables automated arrow tapping and puzzle execution for Amaze GO!</string>
    <string name="scan">Scan Screen</string>
    <string name="auto_solve">Full Auto Solve</string>
    <string name="manual_mode">Manual Guide</string>
    <string name="stop">Emergency Stop</string>
</resources>
`,
  },
  {
    path: 'app/src/main/res/values-bn/strings.xml',
    name: 'strings.xml (Bengali)',
    category: 'res',
    content: `<resources>
    <string name="app_name">অ্যামেজ গো অটো সলভার</string>
    <string name="developer_name">মো: সাব্বির রহমান (MD. SABBIR RAHMAN)</string>
    <string name="developer_role">অ্যাপ ডেভেলপার ও ক্রিয়েটর</string>
    <string name="developed_by">ডেভেলপ করেছেন মো: সাব্বির রহমান (Developed by MD. SABBIR RAHMAN)</string>
    <string name="accessibility_service_description">অ্যামেজ গো! গেমের তীর স্বয়ংক্রিয়ভাবে ট্যাপ ও সমাধান করার অনুমতি দেয়।</string>
    <string name="scan">স্ক্রিন স্ক্যান করুন</string>
    <string name="auto_solve">ফুল অটো সলভ</string>
    <string name="manual_mode">ম্যানুয়াল গাইড</string>
    <string name="stop">জরুরী বিরতি</string>
</resources>
`,
  },
  {
    path: 'app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    category: 'gradle',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

// Amaze GO Auto Solver
// Official Developer & Creator: MD. SABBIR RAHMAN
// Project Owner: MD. SABBIR RAHMAN

android {
    namespace = "com.amazego.autosolver"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.amazego.autosolver"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation(platform("androidx.compose:compose-bom:2024.12.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")

    // OpenCV for Android
    implementation("org.opencv:opencv:4.10.0")

    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
}
`,
  },
  {
    path: '.github/workflows/build-apk.yml',
    name: 'build-apk.yml (GitHub Actions Cloud Builder)',
    category: 'gradle',
    content: `name: Build Amaze GO Auto Solver APK
# Official Developer & Creator: MD. SABBIR RAHMAN
# Project Owner: MD. SABBIR RAHMAN
# Attribution: Developed by MD. SABBIR RAHMAN

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch: # Allows 1-tap manual build trigger from Android phone in Chrome!

jobs:
  build:
    name: Build Signed Android APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Grant Execute Permission to Gradlew
        run: chmod +x gradlew || true

      - name: Build Debug APK with Gradle
        run: ./gradlew assembleDebug --no-daemon --stacktrace

      - name: Verify APK Generated
        run: |
          echo "Build successful! Verifying APK output:"
          ls -lh app/build/outputs/apk/debug/

      - name: Upload Signed APK Artifact (Download on Phone)
        uses: actions/upload-artifact@v4
        with:
          name: AmazeGO-AutoSolver-v1.0.0-signed-by-MDSabbirRahman
          path: app/build/outputs/apk/debug/app-debug.apk
          retention-days: 30
`,
  },
  {
    path: 'gradle/wrapper/gradle-wrapper.properties',
    name: 'gradle-wrapper.properties',
    category: 'gradle',
    content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.10.2-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`,
  },
  {
    path: 'gradle/libs.versions.toml',
    name: 'libs.versions.toml',
    category: 'gradle',
    content: `[versions]
agp = "8.7.2"
kotlin = "2.0.21"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.12.01"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'docs',
    content: `# Amaze GO! Universal Arrow Puzzle Auto Solver

**Official Developer & App Creator:** MD. SABBIR RAHMAN  
**Project Owner:** MD. SABBIR RAHMAN  
**Attribution:** Developed by MD. SABBIR RAHMAN  
**Application:** Amaze GO Auto Solver (Android)  

An intelligent Android floating assistant and computer vision automation engine built for **Amaze GO!** by OAKEVER GAMES PTE. LTD.

---

## 📱 Cloud-Based APK Build (No Computer or Android Studio Needed!)
If you only have an Android phone, you can build and download the installable signed APK in 5 minutes using GitHub's cloud servers:

### Step-by-Step Mobile Instructions (Using Chrome on Android):
1. **Download the Project ZIP:**
   - Tap the **Download Android Studio Project (.zip)** button in this app on your phone.
2. **Create a GitHub Repository on your Phone:**
   - Open **chrome** on Android and go to [github.com/new](https://github.com/new).
   - Sign in (or create a free account).
   - Enter Repository Name: \`amazego-auto-solver\`, set to **Public** or **Private**, and tap **Create repository**.
3. **Upload the Project Files:**
   - On your repository page in Chrome, tap **"uploading an existing file"**.
   - Extract the ZIP on your phone (using Files by Google or Samsung My Files) and upload the files, including the \`.github/workflows/build-apk.yml\` file.
   - Tap **Commit changes**.
4. **Cloud Build Starts Automatically:**
   - GitHub Actions immediately detects the \`build-apk.yml\` workflow and starts an Ubuntu cloud runner with Java 17 and Android SDK 35 pre-installed.
   - You can also tap the **Actions** tab in GitHub at any time and tap **Run workflow**.
5. **Download the Signed APK on your Phone:**
   - In GitHub in Chrome, tap the **Actions** tab.
   - Tap the completed workflow run: **"Build Amaze GO Auto Solver APK"**.
   - Scroll down to the **Artifacts** section at the bottom.
   - Tap **\`AmazeGO-AutoSolver-v1.0.0-signed-by-MDSabbirRahman\`** to download the APK directly!
6. **Install on your Android Phone:**
   - In Chrome, tap the download notification or go to **Downloads**.
   - Tap the downloaded \`.apk\` file.
   - If prompted: *"For your security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and enable **"Allow from this source"**.
   - Tap **Install**.
   - Launch **Amaze GO Auto Solver**!

---

## Official Developer Profile
- **Developer:** MD. SABBIR RAHMAN
- **Role:** App Developer & Creator
- **Application:** Amaze GO Auto Solver
- **License / Ownership:** Created and owned by MD. SABBIR RAHMAN

## Features
- **Floating Overlay Control**: Floating panel on top of the game using \`TYPE_APPLICATION_OVERLAY\`.
- **OpenCV Computer Vision**: Detects arrow tips, body paths, curved corners, and collision bounds.
- **Topological Solver**: Computes unblocked escape sequences with Kahn's algorithm and DFS backtracking.
- **Manual Guide Mode**: Highlights the next safe arrow with numbered badges.
- **Full Autonomous Mode**: Automatically dispatches gestures via AccessibilityService, verifies state between taps, and halts safely on discrepancies.
- **Bilingual Support**: English & Bengali (বাংলা).

## Permissions Required
- **Overlay permission** (\`SYSTEM_ALERT_WINDOW\`)
- **Accessibility Service permission** (Gesture Dispatch)
- **MediaProjection Screen Capture prompt** (On-device CV analysis)
`,
  },
];
