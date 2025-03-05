# Guide de gestion des erreurs pour le backend et le frontend Flutter

Ce document explique comment les erreurs sont formatées dans le backend et comment les traiter dans votre application Flutter.

## Structure du backend

Le backend utilise un système standardisé pour formater les erreurs, ce qui facilite leur traitement côté frontend. Voici les composants principaux :

1. **ApiError** (`src/utils/ApiError.ts`) - Classe de base pour les erreurs API
2. **errorFormatter** (`src/utils/errorFormatter.ts`) - Utilitaire pour formater les erreurs de manière cohérente
3. **error.middleware.ts** (`src/middlewares/error.middleware.ts`) - Middleware Express qui capture et formate les erreurs

## Format des réponses d'erreur

Toutes les erreurs renvoyées par l'API suivent ce format standard :

```json
{
  "success": false,
  "error": true,
  "code": 400,
  "message": "Message d'erreur convivial",
  "details": {
    // Informations supplémentaires sur l'erreur (optionnel)
  },
  "fieldErrors": {
    // Erreurs spécifiques aux champs pour les formulaires (optionnel)
    "email": ["L'email est déjà utilisé"],
    "password": ["Le mot de passe doit contenir au moins 8 caractères"]
  }
}
```

### Codes d'erreur courants

- **400** - Bad Request (requête invalide, erreurs de validation)
- **401** - Unauthorized (non authentifié)
- **403** - Forbidden (authentifié mais non autorisé)
- **404** - Not Found (ressource non trouvée)
- **409** - Conflict (conflit, par exemple email déjà utilisé)
- **422** - Unprocessable Entity (données valides mais inutilisables)
- **500** - Internal Server Error (erreur serveur)

## Implémentation dans Flutter

Un exemple d'implémentation Flutter est fourni dans `src/examples/flutter_error_handling.dart`. Voici les étapes clés pour intégrer ce système dans votre application Flutter :

### 1. Créer un modèle pour les réponses d'erreur

```dart
class ApiErrorResponse {
  final bool success;
  final bool error;
  final int code;
  final String message;
  final Map<String, dynamic>? details;
  final Map<String, List<String>>? fieldErrors;

  ApiErrorResponse({
    required this.success,
    required this.error,
    required this.code,
    required this.message,
    this.details,
    this.fieldErrors,
  });

  factory ApiErrorResponse.fromJson(Map<String, dynamic> json) {
    Map<String, List<String>>? fieldErrorsMap;
    
    if (json['fieldErrors'] != null) {
      fieldErrorsMap = {};
      json['fieldErrors'].forEach((key, value) {
        if (value is List) {
          fieldErrorsMap![key] = List<String>.from(value);
        }
      });
    }

    return ApiErrorResponse(
      success: json['success'] ?? false,
      error: json['error'] ?? true,
      code: json['code'] ?? 500,
      message: json['message'] ?? 'Une erreur est survenue',
      details: json['details'],
      fieldErrors: fieldErrorsMap,
    );
  }
}
```

### 2. Créer un service API qui gère les erreurs

```dart
class ApiService {
  final String baseUrl;
  
  ApiService({required this.baseUrl});
  
  Future<dynamic> handleApiResponse(http.Response response) async {
    final responseBody = json.decode(response.body);
    
    // Si la réponse est un succès (2xx)
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return responseBody;
    }
    
    // Si c'est une erreur, on parse la réponse d'erreur
    throw ApiErrorResponse.fromJson(responseBody);
  }
  
  // Méthodes GET, POST, etc.
}
```

### 3. Gérer les erreurs dans vos écrans

```dart
try {
  final response = await apiService.post('auth/login', {
    'email': email,
    'password': password,
  });
  // Traiter la réponse en cas de succès
} catch (e) {
  if (e is ApiErrorResponse) {
    // Erreur API formatée
    String errorMessage = e.message;
    
    // Gérer les erreurs de champ pour les formulaires
    if (e.fieldErrors != null) {
      // Afficher les erreurs de champ dans le formulaire
    }
    
    // Gérer différents types d'erreurs selon le code
    switch (e.code) {
      case 401:
        // Rediriger vers la page de connexion
        break;
      case 403:
        // Afficher un message d'accès refusé
        break;
      // etc.
    }
  } else {
    // Erreur non-API (réseau, etc.)
    showErrorMessage('Une erreur inattendue est survenue');
  }
}
```

## Bonnes pratiques

1. **Messages d'erreur conviviaux** - Utilisez des messages clairs et compréhensibles pour les utilisateurs
2. **Validation côté client** - Validez les données côté client avant de les envoyer au serveur
3. **Gestion contextuelle** - Adaptez la gestion des erreurs au contexte (formulaire, liste, etc.)
4. **Journalisation** - Journalisez les erreurs côté serveur pour le débogage
5. **Sécurité** - Ne renvoyez jamais de détails sensibles dans les messages d'erreur

## Exemples d'utilisation

### Affichage d'erreurs générales

```dart
if (errorMessage != null) {
  Container(
    padding: const EdgeInsets.all(8.0),
    decoration: BoxDecoration(
      color: Colors.red.shade50,
      borderRadius: BorderRadius.circular(4.0),
      border: Border.all(color: Colors.red.shade200),
    ),
    child: Text(
      errorMessage,
      style: TextStyle(color: Colors.red.shade800),
    ),
  )
}
```

### Affichage d'erreurs de champ dans un formulaire

```dart
TextFormField(
  controller: emailController,
  decoration: InputDecoration(
    labelText: 'Email',
    errorText: fieldErrors['email']?.first,
  ),
)
```

### Widget personnalisé pour les erreurs de champ multiples

```dart
class FieldErrorText extends StatelessWidget {
  final List<String>? errors;
  
  const FieldErrorText({Key? key, this.errors}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    if (errors == null || errors!.isEmpty) {
      return const SizedBox.shrink();
    }
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: errors!.map((error) => 
        Padding(
          padding: const EdgeInsets.only(top: 4.0),
          child: Text(
            error,
            style: const TextStyle(
              color: Colors.red,
              fontSize: 12,
            ),
          ),
        )
      ).toList(),
    );
  }
}
