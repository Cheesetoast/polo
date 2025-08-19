# Contentful Setup Guide

## Content Type to Create in Contentful

### Homepage Content Type
**Content Type ID:** `homepage`

**Fields:**
- `title` (Short text) - Required - This will be displayed as the main heading on your homepage

## Environment Variables

Add these to your `.env` file:

```bash
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
CONTENTFUL_ENVIRONMENT=master
```

## Getting Your Contentful Credentials

1. Go to [Contentful](https://app.contentful.com)
2. Select your space
3. Go to Settings → API keys
4. Create a new API key or use the default one
5. Copy the Space ID and Content Delivery API access token

## Publishing Content

After creating your content types and adding content:
1. Create entries for each content type
2. Publish the entries
3. Your Gatsby site will automatically fetch the published content
