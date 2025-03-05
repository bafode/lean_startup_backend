# Guide d'implémentation de la gestion des erreurs

Ce guide explique comment implémenter la gestion des erreurs dans vos contrôleurs et services pour assurer une expérience utilisateur cohérente et des messages d'erreur clairs.

## Table des matières

1. [Principes de base](#principes-de-base)
2. [Implémentation dans les services](#implémentation-dans-les-services)
3. [Implémentation dans les contrôleurs](#implémentation-dans-les-contrôleurs)
4. [Bonnes pratiques](#bonnes-pratiques)
5. [Exemples complets](#exemples-complets)

## Principes de base

Notre système de gestion d'erreurs repose sur trois composants principaux :

1. **ApiError** - Classe de base pour les erreurs API
2. **formatErrorForClient** - Utilitaire pour formater les erreurs
3. **error.middleware.ts** - Middleware qui capture et formate les erreurs

Le flux de gestion des erreurs est le suivant :

1. Une erreur est levée dans un service ou un contrôleur
2. Le middleware `catchReq` capture l'erreur
3. Le middleware `errorConverter` convertit l'erreur en `ApiError` si nécessaire
4. Le middleware `errorHandler` utilise `formatErrorForClient` pour formater l'erreur
5. La réponse d'erreur formatée est envoyée au client

## Implémentation dans les services

Les services sont responsables de la logique métier et doivent lever des erreurs appropriées lorsque des problèmes surviennent.

### Principes pour les services

1. **Utiliser ApiError avec des codes HTTP appropriés**
2. **Fournir des messages d'erreur clairs et en français**
3. **Capturer et transformer les erreurs externes**
4. **Valider les entrées au début des fonctions**

### Exemple de base

```typescript
import httpStatus from 'http-status';
import { ApiError } from '../utils';

const someServiceFunction = async (param1: string, param2: number) => {
  // 1. Validation des entrées
  if (!param1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Le paramètre 1 est requis');
  }
  
  try {
    // 2. Logique métier
    const result = await someOperation();
    
    // 3. Vérification des résultats
    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Ressource non trouvée');
    }
    
    return result;
  } catch (error) {
    // 4. Gestion des erreurs externes
    if (!(error instanceof ApiError)) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Une erreur est survenue lors du traitement',
        false,
        error.stack
      );
    }
    throw error;
  }
};
```

### Gestion des erreurs de validation Mongoose

```typescript
try {
  return await User.create(userData);
} catch (error) {
  // Erreurs de validation Mongoose
  if (error.name === 'ValidationError') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Erreur de validation des données',
      true,
      error.stack
    );
  }
  
  // Erreurs de duplication MongoDB
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    throw new ApiError(
      httpStatus.CONFLICT,
      `Le champ ${field} existe déjà`,
      true,
      error.stack
    );
  }
  
  throw error;
}
```

## Implémentation dans les contrôleurs

Les contrôleurs sont responsables de la gestion des requêtes HTTP et doivent utiliser le format de réponse standardisé.

### Principes pour les contrôleurs

1. **Utiliser le wrapper `catchReq` pour toutes les fonctions**
2. **Utiliser l'utilitaire `response` pour les réponses réussies**
3. **Laisser remonter les erreurs au middleware**
4. **Valider les entrées avant d'appeler les services**

### Exemple de base

```typescript
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchReq, response, ApiError } from '../utils';
import { someService } from '../services';

const someController = catchReq(async (req: Request, res: Response) => {
  try {
    // 1. Validation des entrées
    const { param1, param2 } = req.body;
    
    if (!param1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Le paramètre 1 est requis');
    }
    
    // 2. Appel au service
    const result = await someService.someFunction(param1, param2);
    
    // 3. Réponse formatée
    res.status(httpStatus.OK).send(response({
      data: result,
      success: true,
      error: false,
      message: 'Opération réussie',
      status: httpStatus.OK
    }));
  } catch (error) {
    // 4. Laisser remonter l'erreur au middleware
    throw error;
  }
});
```

### Gestion des réponses de succès

```typescript
// Création réussie (201)
res.status(httpStatus.CREATED).send(response({
  data: newEntity,
  success: true,
  error: false,
  message: 'Ressource créée avec succès',
  status: httpStatus.CREATED
}));

// Mise à jour réussie (200)
res.status(httpStatus.OK).send(response({
  data: updatedEntity,
  success: true,
  error: false,
  message: 'Ressource mise à jour avec succès',
  status: httpStatus.OK
}));

// Suppression réussie (200)
res.status(httpStatus.OK).send(response({
  data: null,
  success: true,
  error: false,
  message: 'Ressource supprimée avec succès',
  status: httpStatus.OK
}));
```

## Bonnes pratiques

### Messages d'erreur

1. **Soyez spécifique mais pas trop technique**
   - ✅ "Cet email est déjà utilisé"
   - ❌ "Erreur de duplication de clé sur le champ email"

2. **Utilisez un langage simple et direct**
   - ✅ "Le mot de passe doit contenir au moins 8 caractères"
   - ❌ "Validation échouée pour le champ password"

3. **Adaptez le message au contexte**
   - Pour la connexion : "Email ou mot de passe incorrect" (ne pas préciser lequel)
   - Pour l'inscription : "Cet email est déjà utilisé" (message spécifique)

### Codes HTTP

Utilisez les codes HTTP appropriés :

- **400 Bad Request** - Requête invalide, erreurs de validation
- **401 Unauthorized** - Non authentifié
- **403 Forbidden** - Authentifié mais non autorisé
- **404 Not Found** - Ressource non trouvée
- **409 Conflict** - Conflit (ex: email déjà utilisé)
- **422 Unprocessable Entity** - Données valides mais inutilisables
- **500 Internal Server Error** - Erreur serveur

### Sécurité

1. **Ne révélez pas d'informations sensibles**
   - ✅ "Une erreur est survenue lors de la connexion à la base de données"
   - ❌ "Erreur de connexion à MongoDB: mongodb://user:password@host:27017/db"

2. **Évitez les attaques par énumération**
   - ✅ "Si un compte existe avec cet email, un email de réinitialisation a été envoyé"
   - ❌ "Aucun compte trouvé avec cet email"

3. **Journalisez les erreurs côté serveur**
   - Journalisez les détails techniques pour le débogage
   - N'envoyez que des messages conviviaux aux utilisateurs

## Exemples complets

Des exemples complets d'implémentation sont disponibles dans :

- `src/examples/auth-service-example.ts` - Exemple de service d'authentification
- `src/examples/auth-controller-example.ts` - Exemple de contrôleur d'authentification

Ces exemples montrent comment implémenter la gestion des erreurs dans un contexte réel.

## Résumé

1. **Services** : Levez des `ApiError` avec des codes HTTP et messages appropriés
2. **Contrôleurs** : Utilisez `catchReq` et `response` pour des réponses cohérentes
3. **Messages** : Clairs, spécifiques et adaptés au contexte
4. **Sécurité** : Ne révélez pas d'informations sensibles
5. **Cohérence** : Utilisez le même format pour toutes les réponses
