# Suggestions de Phrases IA

Cette fonctionnalité utilise l'IA (OpenAI) pour générer automatiquement des phrases éducatives adaptées au thème sélectionné.

## Configuration

### 1. Clé API OpenAI (Optionnelle)
L'application fonctionne même sans clé API en utilisant des phrases de fallback intelligentes.

Pour activer les vraies suggestions IA :
- Copiez `.env.example` vers `.env`
- Ajoutez votre clé OpenAI : `OPENAI_API_KEY=sk-votre-clé-api-ici`
- Redémarrez le serveur Django

### 2. Installation des dépendances
Assurez-vous que Python peut faire des requêtes HTTP (urllib est inclus par défaut).

## Fonctionnement

### Backend
- **Endpoint**: `GET /api/ai/phrases/?theme={theme_slug}&lang=ar`
- **Paramètres**:
  - `theme`: Slug du thème (obligatoire)
  - `lang`: Langue des phrases (défaut: 'ar' pour arabe)
- **Réponse**: JSON avec les phrases générées

### Frontend
- **Composant**: `PhraseSuggestions.jsx`
- **Intégration**: Automatiquement affiché dans chaque page de thème
- **Fonctionnalité**:
  - Génère 3 phrases par thème
  - Bouton "جديد" pour régénérer
  - Clic sur une phrase l'ajoute automatiquement à la sélection

## Utilisation

1. Naviguez vers n'importe quel thème
2. Les suggestions IA apparaissent automatiquement en bas de la page
3. Cliquez sur une phrase pour l'ajouter à votre sélection
4. Cliquez sur "جديد" pour générer de nouvelles phrases

## Personnalisation

### Modifier le prompt IA
Dans `views.py`, fonction `generate_phrases_from_openai()` :

```python
prompt = f"""Génère 3 phrases simples et éducatives en {language} pour un enfant apprenant à parler.
Thème: {theme_name}
Éléments disponibles: {items_list}

Les phrases doivent:
- Être courtes et faciles à comprendre
- Utiliser les éléments du thème
- Être adaptées à l'orthophonie (prononciation claire)
- Varier dans leur structure

Réponds uniquement avec un JSON array de 3 phrases, sans texte supplémentaire.
Format: ["Phrase 1", "Phrase 2", "Phrase 3"]"""
```

### Changer le nombre de phrases
Modifiez le paramètre dans le prompt et ajustez la validation.

### Ajouter d'autres langues
Le système supporte déjà le paramètre `lang`, il suffit de l'utiliser dans l'interface.

## Fallback
En cas d'absence de clé API ou d'erreur, le système propose des phrases de fallback génériques en arabe adaptées au thème.

## Sécurité
- La clé API est stockée côté serveur uniquement
- Les requêtes sont faites depuis le backend, pas directement depuis le frontend
- Gestion d'erreur en cas d'indisponibilité de l'API