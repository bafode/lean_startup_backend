# Implémentation des Notifications dans l'Application Flutter

Ce document fournit le code nécessaire pour implémenter le nouveau système de notification dans votre application Flutter.

## 1. Modèle de Notification

Créez un fichier `lib/models/notification_model.dart` :

```dart
import 'package:intl/intl.dart';

enum NotificationType {
  voiceCall,
  videoCall,
  textMessage,
  callCanceled,
  like,
  comment,
  follow,
  mention,
  tag,
  share,
  newPost,
  friendRequest,
  friendAccept,
  system
}

enum NotificationStatus {
  unread,
  read,
  archived
}

class NotificationModel {
  final String id;
  final String senderId;
  final String senderName;
  final String senderAvatar;
  final NotificationType type;
  final NotificationStatus status;
  final String? targetId;
  final String? targetType;
  final String? message;
  final DateTime createdAt;
  
  NotificationModel({
    required this.id,
    required this.senderId,
    required this.senderName,
    required this.senderAvatar,
    required this.type,
    required this.status,
    this.targetId,
    this.targetType,
    this.message,
    required this.createdAt,
  });
  
  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    // Convertir le type de notification depuis la chaîne
    NotificationType parseType(String typeStr) {
      switch (typeStr) {
        case 'voice_call': return NotificationType.voiceCall;
        case 'video_call': return NotificationType.videoCall;
        case 'text_message': return NotificationType.textMessage;
        case 'call_canceled': return NotificationType.callCanceled;
        case 'like': return NotificationType.like;
        case 'comment': return NotificationType.comment;
        case 'follow': return NotificationType.follow;
        case 'mention': return NotificationType.mention;
        case 'tag': return NotificationType.tag;
        case 'share': return NotificationType.share;
        case 'new_post': return NotificationType.newPost;
        case 'friend_request': return NotificationType.friendRequest;
        case 'friend_accept': return NotificationType.friendAccept;
        case 'system': return NotificationType.system;
        default: return NotificationType.system;
      }
    }
    
    // Convertir le statut de notification depuis la chaîne
    NotificationStatus parseStatus(String statusStr) {
      switch (statusStr) {
        case 'read': return NotificationStatus.read;
        case 'archived': return NotificationStatus.archived;
        default: return NotificationStatus.unread;
      }
    }
    
    // Extraire les informations de l'expéditeur
    final sender = json['sender'] as Map<String, dynamic>? ?? {};
    final String senderName = '${sender['firstname'] ?? ''} ${sender['lastname'] ?? ''}'.trim();
    
    return NotificationModel(
      id: json['id'] ?? json['_id'] ?? '',
      senderId: json['sender']?['id'] ?? json['sender']?['_id'] ?? '',
      senderName: senderName,
      senderAvatar: sender['avatar'] ?? '',
      type: parseType(json['type'] ?? ''),
      status: parseStatus(json['status'] ?? ''),
      targetId: json['targetId'] ?? '',
      targetType: json['targetType'] ?? '',
      message: json['message'] ?? '',
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : DateTime.now(),
    );
  }
  
  String get formattedDate {
    final now = DateTime.now();
    final difference = now.difference(createdAt);
    
    if (difference.inDays > 7) {
      return DateFormat('dd/MM/yyyy').format(createdAt);
    } else if (difference.inDays > 0) {
      return '${difference.inDays}j';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m';
    } else {
      return 'À l\'instant';
    }
  }
  
  String get notificationTitle {
    switch (type) {
      case NotificationType.like:
        return 'Nouveau like';
      case NotificationType.comment:
        return 'Nouveau commentaire';
      case NotificationType.follow:
        return 'Nouvel abonné';
      case NotificationType.mention:
        return 'Nouvelle mention';
      case NotificationType.tag:
        return 'Nouveau tag';
      case NotificationType.share:
        return 'Nouveau partage';
      case NotificationType.newPost:
        return 'Nouvelle publication';
      case NotificationType.friendRequest:
        return 'Demande d\'ami';
      case NotificationType.friendAccept:
        return 'Demande acceptée';
      case NotificationType.voiceCall:
        return 'Appel vocal';
      case NotificationType.videoCall:
        return 'Appel vidéo';
      case NotificationType.textMessage:
        return 'Nouveau message';
      case NotificationType.callCanceled:
        return 'Appel manqué';
      case NotificationType.system:
        return 'Notification système';
      default:
        return 'Notification';
    }
  }
  
  String get notificationBody {
    switch (type) {
      case NotificationType.like:
        return '$senderName a aimé votre publication';
      case NotificationType.comment:
        return '$senderName a commenté votre publication';
      case NotificationType.follow:
        return '$senderName a commencé à vous suivre';
      case NotificationType.mention:
        return '$senderName vous a mentionné dans une publication';
      case NotificationType.tag:
        return '$senderName vous a tagué dans une publication';
      case NotificationType.share:
        return '$senderName a partagé votre publication';
      case NotificationType.newPost:
        return '$senderName a publié quelque chose de nouveau';
      case NotificationType.friendRequest:
        return '$senderName vous a envoyé une demande d\'ami';
      case NotificationType.friendAccept:
        return '$senderName a accepté votre demande d\'ami';
      case NotificationType.voiceCall:
        return 'Appel vocal de $senderName';
      case NotificationType.videoCall:
        return 'Appel vidéo de $senderName';
      case NotificationType.textMessage:
        return 'Message de $senderName';
      case NotificationType.callCanceled:
        return 'Appel manqué de $senderName';
      case NotificationType.system:
        return message ?? 'Vous avez une notification système';
      default:
        return message ?? 'Vous avez une nouvelle notification';
    }
  }
}
```

## 2. Service de Notification

Créez un fichier `lib/services/notification_service.dart` :

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/notification_model.dart';
import '../utils/api_config.dart';
import '../utils/auth_service.dart';

class NotificationService {
  final String baseUrl = ApiConfig.baseUrl;
  final AuthService authService;
  
  NotificationService({required this.authService});
  
  // Récupérer les notifications de l'utilisateur
  Future<Map<String, dynamic>> getNotifications({
    int page = 1,
    int limit = 10,
    NotificationStatus? status,
  }) async {
    try {
      final token = await authService.getToken();
      if (token == null) {
        throw Exception('Non authentifié');
      }
      
      String url = '$baseUrl/v1/notifications?page=$page&limit=$limit';
      if (status != null) {
        String statusStr;
        switch (status) {
          case NotificationStatus.read:
            statusStr = 'read';
            break;
          case NotificationStatus.archived:
            statusStr = 'archived';
            break;
          default:
            statusStr = 'unread';
        }
        url += '&status=$statusStr';
      }
      
      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        if (data['code'] == 0 && data['data'] != null) {
          final notificationsData = data['data'];
          final List<dynamic> notificationsJson = notificationsData['notifications'] ?? [];
          final List<NotificationModel> notifications = notificationsJson
              .map((json) => NotificationModel.fromJson(json))
              .toList();
          
          return {
            'notifications': notifications,
            'pagination': notificationsData['pagination'] ?? {},
          };
        }
        throw Exception('Erreur lors de la récupération des notifications: ${data['msg']}');
      } else {
        throw Exception('Erreur ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      rethrow;
    }
  }
  
  // Marquer des notifications comme lues
  Future<bool> markAsRead(List<String> notificationIds) async {
    try {
      final token = await authService.getToken();
      if (token == null) {
        throw Exception('Non authentifié');
      }
      
      final response = await http.post(
        Uri.parse('$baseUrl/v1/notifications/mark-read'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'notification_ids': notificationIds,
        }),
      );
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return data['code'] == 0;
      } else {
        throw Exception('Erreur ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      rethrow;
    }
  }
  
  // Marquer toutes les notifications comme lues
  Future<bool> markAllAsRead() async {
    try {
      final token = await authService.getToken();
      if (token == null) {
        throw Exception('Non authentifié');
      }
      
      final response = await http.post(
        Uri.parse('$baseUrl/v1/notifications/mark-all-read'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return data['code'] == 0;
      } else {
        throw Exception('Erreur ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      rethrow;
    }
  }
  
  // Supprimer une notification
  Future<bool> deleteNotification(String notificationId) async {
    try {
      final token = await authService.getToken();
      if (token == null) {
        throw Exception('Non authentifié');
      }
      
      final response = await http.delete(
        Uri.parse('$baseUrl/v1/notifications/$notificationId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return data['code'] == 0;
      } else {
        throw Exception('Erreur ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      rethrow;
    }
  }
  
  // Compter les notifications non lues
  Future<int> getUnreadCount() async {
    try {
      final token = await authService.getToken();
      if (token == null) {
        throw Exception('Non authentifié');
      }
      
      final response = await http.get(
        Uri.parse('$baseUrl/v1/notifications/unread-count'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        if (data['code'] == 0 && data['data'] != null) {
          return data['data']['unreadCount'] ?? 0;
        }
        return 0;
      } else {
        throw Exception('Erreur ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      return 0;
    }
  }
  
  // Envoyer une notification sociale
  Future<bool> sendSocialNotification({
    required String toUserId,
    required NotificationType type,
    String? targetId,
    String? targetType,
    String? message,
  }) async {
    try {
      final token = await authService.getToken();
      if (token == null) {
        throw Exception('Non authentifié');
      }
      
      // Convertir le type de notification en chaîne
      String typeStr;
      switch (type) {
        case NotificationType.like:
          typeStr = 'like';
          break;
        case NotificationType.comment:
          typeStr = 'comment';
          break;
        case NotificationType.follow:
          typeStr = 'follow';
          break;
        case NotificationType.mention:
          typeStr = 'mention';
          break;
        case NotificationType.tag:
          typeStr = 'tag';
          break;
        case NotificationType.share:
          typeStr = 'share';
          break;
        case NotificationType.newPost:
          typeStr = 'new_post';
          break;
        case NotificationType.friendRequest:
          typeStr = 'friend_request';
          break;
        case NotificationType.friendAccept:
          typeStr = 'friend_accept';
          break;
        case NotificationType.system:
          typeStr = 'system';
          break;
        default:
          typeStr = 'system';
      }
      
      final response = await http.post(
        Uri.parse('$baseUrl/v1/notifications/social'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'to_token': toUserId,
          'type': typeStr,
          'target_id': targetId,
          'target_type': targetType,
          'message': message,
        }),
      );
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return data['code'] == 0;
      } else {
        throw Exception('Erreur ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      rethrow;
    }
  }
}
```

## 3. Gestionnaire de Notifications Push

Créez un fichier `lib/services/push_notification_handler.dart` :

```dart
import 'dart:convert';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../models/notification_model.dart';

class PushNotificationHandler {
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();
  
  // Fonction à appeler lorsqu'une notification est tapée
  final Function(NotificationType type, String? targetId, String? targetType)? onNotificationTap;
  
  PushNotificationHandler({this.onNotificationTap});
  
  Future<void> initialize() async {
    // Demander la permission pour les notifications
    await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
    
    // Configurer les notifications locales
    const AndroidInitializationSettings initializationSettingsAndroid = 
        AndroidInitializationSettings('@mipmap/ic_launcher');
    
    const DarwinInitializationSettings initializationSettingsIOS = 
        DarwinInitializationSettings(
      requestSoundPermission: true,
      requestBadgePermission: true,
      requestAlertPermission: true,
    );
    
    const InitializationSettings initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsIOS,
    );
    
    await _flutterLocalNotificationsPlugin.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: _onSelectNotification,
    );
    
    // Configurer les gestionnaires de notifications Firebase
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);
    
    // Vérifier si l'application a été ouverte à partir d'une notification
    final RemoteMessage? initialMessage = await FirebaseMessaging.instance.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationTap(initialMessage);
    }
  }
  
  // Obtenir le token FCM
  Future<String?> getFcmToken() async {
    return await _firebaseMessaging.getToken();
  }
  
  // Gérer les messages reçus lorsque l'application est au premier plan
  void _handleForegroundMessage(RemoteMessage message) {
    print('Notification reçue en premier plan: ${message.data}');
    
    // Extraire les données de la notification
    final data = message.data;
    final notification = message.notification;
    
    if (notification != null) {
      // Afficher une notification locale
      _showLocalNotification(
        id: DateTime.now().millisecondsSinceEpoch ~/ 1000,
        title: notification.title ?? 'Nouvelle notification',
        body: notification.body ?? '',
        payload: json.encode(data),
      );
    }
  }
  
  // Gérer le tap sur une notification
  void _handleNotificationTap(RemoteMessage message) {
    print('Notification tapée: ${message.data}');
    
    if (onNotificationTap != null) {
      final data = message.data;
      
      // Déterminer le type de notification
      NotificationType type = NotificationType.system;
      if (data['notification_type'] != null && data['notification_type'].isNotEmpty) {
        switch (data['notification_type']) {
          case 'like':
            type = NotificationType.like;
            break;
          case 'comment':
            type = NotificationType.comment;
            break;
          case 'follow':
            type = NotificationType.follow;
            break;
          // ... autres types
        }
      } else if (data['call_type'] != null && data['call_type'].isNotEmpty) {
        switch (data['call_type']) {
          case 'voice':
            type = NotificationType.voiceCall;
            break;
          case 'video':
            type = NotificationType.videoCall;
            break;
          case 'text':
            type = NotificationType.textMessage;
            break;
          case 'cancel':
            type = NotificationType.callCanceled;
            break;
        }
      }
      
      // Appeler le callback avec les informations de la notification
      onNotificationTap!(
        type,
        data['target_id'],
        data['target_type'],
      );
    }
  }
  
  // Gérer le tap sur une notification locale
  void _onSelectNotification(NotificationResponse response) {
    if (onNotificationTap != null && response.payload != null) {
      try {
        final data = json.decode(response.payload!);
        
        // Déterminer le type de notification
        NotificationType type = NotificationType.system;
        if (data['notification_type'] != null && data['notification_type'].isNotEmpty) {
          switch (data['notification_type']) {
            case 'like':
              type = NotificationType.like;
              break;
            case 'comment':
              type = NotificationType.comment;
              break;
            case 'follow':
              type = NotificationType.follow;
              break;
            // ... autres types
          }
        } else if (data['call_type'] != null && data['call_type'].isNotEmpty) {
          switch (data['call_type']) {
            case 'voice':
              type = NotificationType.voiceCall;
              break;
            case 'video':
              type = NotificationType.videoCall;
              break;
            case 'text':
              type = NotificationType.textMessage;
              break;
            case 'cancel':
              type = NotificationType.callCanceled;
              break;
          }
        }
        
        // Appeler le callback avec les informations de la notification
        onNotificationTap!(
          type,
          data['target_id'],
          data['target_type'],
        );
      } catch (e) {
        print('Erreur lors du parsing du payload: $e');
      }
    }
  }
  
  // Afficher une notification locale
  Future<void> _showLocalNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
  }) async {
    const AndroidNotificationDetails androidPlatformChannelSpecifics =
        AndroidNotificationDetails(
      'com.beehiveapp.beehive.notification',
      'Notifications',
      channelDescription: 'Canal pour les notifications sociales',
      importance: Importance.max,
      priority: Priority.high,
      showWhen: true,
    );
    
    const NotificationDetails platformChannelSpecifics = NotificationDetails(
      android: androidPlatformChannelSpecifics,
      iOS: DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      ),
    );
    
    await _flutterLocalNotificationsPlugin.show(
      id,
      title,
      body,
      platformChannelSpecifics,
      payload: payload,
    );
  }
}
```

## 4. Écran de Liste des Notifications

Créez un fichier `lib/screens/notifications_screen.dart` :

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/notification_model.dart';
import '../services/notification_service.dart';
import '../providers/auth_provider.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({Key? key}) : super(key: key);

  @override
  _NotificationsScreenState createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  late NotificationService _notificationService;
  List<NotificationModel> _notifications = [];
  bool _isLoading = true;
  bool _hasError = false;
  String _errorMessage = '';
  int _currentPage = 1;
  int _totalPages = 1;
  bool _hasMorePages = false;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    _notificationService = NotificationService(authService: authProvider.authService);
    _loadNotifications();

    _scrollController.addListener(() {
      if (_scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
        if (_hasMorePages) {
          _loadMoreNotifications();
        }
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadNotifications() async {
    setState(() {
      _isLoading = true;
      _hasError = false;
      _errorMessage = '';
    });

    try {
      final result = await _notificationService.getNotifications(page: 1, limit: 20);
      setState(() {
        _notifications = result['notifications'] as List<NotificationModel>;
        final pagination = result['pagination'] as Map<String, dynamic>;
        _currentPage = pagination['page'] as int? ?? 1;
        _totalPages = pagination['pages'] as int? ?? 1;
        _hasMorePages = _currentPage < _totalPages;
        _isLoading = false;
      });

      // Marquer toutes les notifications comme lues
      if (_notifications.isNotEmpty) {
        final unreadNotifications = _notifications
            .where((notification) => notification.status == NotificationStatus.unread)
            .map((notification) => notification.id)
            .toList();

        if (unreadNotifications.isNotEmpty) {
          await _notificationService.markAsRead(unreadNotifications);
        }
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _hasError = true;
        _errorMessage = e.toString();
      });
    }
  }

  Future<void> _loadMoreNotifications() async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final result = await _notificationService.getNotifications(
        page: _currentPage + 1,
        limit: 20,
      );

      final newNotifications = result['notifications'] as List<NotificationModel>;
      final pagination = result['pagination'] as Map<String, dynamic>;

      setState(() {
        _notifications.addAll(newNotifications);
        _currentPage = pagination['page'] as int? ?? _currentPage + 1;
        _totalPages = pagination['pages'] as int? ?? _totalPages;
        _hasMorePages = _currentPage < _totalPages;
        _isLoading = false;
      });

      // Marquer les nouvelles notifications comme lues
      if (newNotifications.isNotEmpty) {
        final unreadNotifications = newNotifications
            .where((notification) => notification.status == NotificationStatus.unread)
            .map((notification) => notification.id)
            .toList();

        if (unreadNotifications.isNotEmpty) {
          await _notificationService.markAsRead(unreadNotifications);
        }
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _hasError = true;
        _errorMessage = e.toString();
      });
    }
  }

  Future<void> _deleteNotification(String id) async {
    try {
      final success = await _notificationService.deleteNotification(id);
      if (success) {
        setState(() {
          _notifications.removeWhere((notification) => notification.id == id);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Notification supprimée')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur: ${e.toString()}')),
      );
    }
  }

  void _handleNotificationTap(NotificationModel notification) {
    // Naviguer vers l'écran approprié en fonction du type de notification
    switch (notification.type) {
      case NotificationType.like:
      case NotificationType.comment:
      case NotificationType.share:
        if (notification.targetId != null && notification.targetType == 'Post') {
          // Naviguer vers le post
          // Navigator.pushNamed(context, '/post', arguments: notification.targetId);
        }
        break;
      case NotificationType.follow:
      case NotificationType.friendRequest:
      case NotificationType.friendAccept:
        if (notification.senderId.isNotEmpty) {
          // Naviguer vers le profil de l'utilisateur
          // Navigator.pushNamed(context, '/profile', arguments: notification.senderId);
        }
        break;
      case NotificationType.mention:
      case NotificationType.tag:
        if (notification.targetId != null) {
          // Naviguer vers le contenu où l'utilisateur est mentionné/tagué
          // Navigator.pushNamed(context, '/post', arguments: notification.targetId);
        }
        break;
      case NotificationType.newPost:
        if (notification.senderId.isNotEmpty) {
          // Naviguer vers le profil de l'utilisateur pour voir ses posts
          // Navigator.pushNamed(context, '/profile', arguments: notification.senderId);
        }
        break;
      case NotificationType.voiceCall:
      case NotificationType.videoCall:
      case NotificationType.textMessage:
        // Naviguer vers la conversation
        // Navigator.pushNamed(context, '/chat', arguments: notification.senderId);
        break;
      default:
        // Ne rien faire pour les autres types
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadNotifications,
          ),
        ],
      ),
      body: _hasError
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Une erreur est survenue'),
                  Text(_errorMessage),
                  ElevatedButton(
                    onPressed: _loadNotifications,
                    child: const Text('Réessayer'),
                  ),
                ],
              ),
            )
          : _notifications.isEmpty && !_isLoading
              ? const Center(
                  child: Text('Aucune notification'),
                )
              : RefreshIndicator(
                  onRefresh: _loadNotifications,
                  child: ListView.builder(
                    controller: _scrollController,
                    itemCount: _notifications.length + (_hasMorePages ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == _notifications.length) {
                        return const Center(
                          child: Padding(
                            padding: EdgeInsets.all(8.0),
                            child: CircularProgressIndicator(),
                          ),
                        );
                      }
                      
                      final notification = _notifications[index];
                      return Dismissible(
                        key: Key(notification.id),
                        background: Container(
                          color: Colors.red,
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 20.0),
                          child: const Icon(
                            Icons.delete,
                            color: Colors.white,
                          ),
                        ),
                        direction: DismissDirection.endToStart,
                        onDismissed: (direction) {
                          _deleteNotification(notification.id);
                        },
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundImage: notification.senderAvatar.isNotEmpty
                                ? NetworkImage(notification.senderAvatar)
                                : null,
                            child: notification.senderAvatar.isEmpty
                                ? const Icon(Icons.person)
                                : null,
                          ),
                          title: Text(notification.notificationTitle),
                          subtitle: Text(notification.notificationBody),
                          trailing: Text(notification.formattedDate),
                          onTap: () => _handleNotificationTap(notification),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
```

## 5. Exemple d'utilisation

Voici comment intégrer le système de notification dans votre application Flutter :

### 1. Initialisation dans main.dart

```dart
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/push_notification_handler.dart';
import 'providers/auth_provider.dart';
import 'providers/notification_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => NotificationProvider()),
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late PushNotificationHandler _notificationHandler;
  
  @override
  void initState() {
    super.initState();
    _initializeNotifications();
  }
  
  Future<void> _initializeNotifications() async {
    _notificationHandler = PushNotificationHandler(
      onNotificationTap: _handleNotificationTap,
    );
    
    await _notificationHandler.initialize();
    
    // Obtenir et sauvegarder le token FCM
    final fcmToken = await _notificationHandler.getFcmToken();
    if (fcmToken != null) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      // Mettre à jour le token FCM sur le serveur lors de la connexion
      authProvider.setFcmToken(fcmToken);
    }
  }
  
  void _handleNotificationTap(NotificationType type, String? targetId, String? targetType) {
    // Naviguer vers l'écran approprié en fonction du type de notification
    switch (type) {
      case NotificationType.like:
      case NotificationType.comment:
      case NotificationType.share:
        if (targetId != null && targetType == 'Post') {
          // Naviguer vers le post
          Navigator.of(context).pushNamed('/post', arguments: targetId);
        }
        break;
      case NotificationType.follow:
      case NotificationType.friendRequest:
      case NotificationType.friendAccept:
        // Naviguer vers le profil de l'utilisateur
        Navigator.of(context).pushNamed('/profile', arguments: targetId);
        break;
      // Gérer les autres types de notifications...
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mon Application',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => HomePage(),
        '/notifications': (context) => NotificationsScreen(),
        // Autres routes...
      },
    );
  }
}
```

### 2. Créer un Provider pour les notifications

Créez un fichier `lib/providers/notification_provider.dart` :

```dart
import 'package:flutter/foundation.dart';
import '../services/notification_service.dart';
import '../models/notification_model.dart';

class NotificationProvider with ChangeNotifier {
  int _unreadCount = 0;
  
  int get unreadCount => _unreadCount;
  
  // Mettre à jour le compteur de notifications non lues
  Future<void> updateUnreadCount(NotificationService notificationService) async {
    try {
      final count = await notificationService.getUnreadCount();
      _unreadCount = count;
      notifyListeners();
    } catch (e) {
      print('Erreur lors de la récupération du nombre de notifications non lues: $e');
    }
  }
  
  // Réinitialiser le compteur de notifications non lues
  void resetUnreadCount() {
    _unreadCount = 0;
    notifyListeners();
  }
  
  // Incrémenter le compteur de notifications non lues
  void incrementUnreadCount() {
    _unreadCount++;
    notifyListeners();
  }
}
```

### 3. Ajouter un badge de notification dans votre interface

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/notification_provider.dart';
import '../services/notification_service.dart';
import '../providers/auth_provider.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late NotificationService _notificationService;
  
  @override
  void initState() {
    super.initState();
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    _notificationService = NotificationService(authService: authProvider.authService);
    
    // Mettre à jour le compteur de notifications non lues
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _updateUnreadCount();
    });
  }
  
  Future<void> _updateUnreadCount() async {
    final notificationProvider = Provider.of<NotificationProvider>(context, listen: false);
    await notificationProvider.updateUnreadCount(_notificationService);
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Accueil'),
        actions: [
          // Badge de notification
          Stack(
            children: [
              IconButton(
                icon: Icon(Icons.notifications),
                onPressed: () {
                  Navigator.pushNamed(context, '/notifications');
                  // Réinitialiser le compteur après avoir visité l'écran des notifications
                  Provider.of<NotificationProvider>(context, listen: false).resetUnreadCount();
                },
              ),
              Consumer<NotificationProvider>(
                builder: (context, notificationProvider, child) {
                  return notificationProvider.unreadCount > 0
                      ? Positioned(
                          right: 0,
                          top: 0,
                          child: Container(
                            padding: EdgeInsets.all(2),
                            decoration: BoxDecoration(
                              color: Colors.red,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            constraints: BoxConstraints(
                              minWidth: 16,
                              minHeight: 16,
                            ),
                            child: Text(
                              '${notificationProvider.unreadCount}',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        )
                      : SizedBox.shrink();
                },
              ),
            ],
          ),
        ],
      ),
      body: Center(
        child: Text('Contenu de la page d\'accueil'),
      ),
    );
  }
}
```

### 4. Exemple d'envoi d'une notification sociale

```dart
// Exemple d'envoi d'une notification de like
Future<void> likePost(String postId, String postOwnerId) async {
  try {
    // Logique pour liker le post...
    
    // Envoyer une notification au propriétaire du post
    if (postOwnerId != currentUserId) {
      await notificationService.sendSocialNotification(
        toUserId: postOwnerId,
        type: NotificationType.like,
        targetId: postId,
        targetType: 'Post',
      );
    }
  } catch (e) {
    print('Erreur lors du like du post: $e');
  }
}
```

## 6. Dépendances requises

Ajoutez ces dépendances à votre fichier `pubspec.yaml` :

```yaml
dependencies:
  flutter:
    sdk: flutter
  firebase_core: ^2.15.0
  firebase_messaging: ^14.6.5
  flutter_local_notifications: ^15.1.0+1
  provider: ^6.0.5
  http: ^1.1.0
  intl: ^0.18.1
```

Exécutez ensuite `flutter pub get` pour installer les dépendances.
