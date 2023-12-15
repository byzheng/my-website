---
date: "2022-10-24"
sections:
- block: about.avatar
  content:
    text: null
    username: bangyou-zheng
  id: about
- block: collection
  content:
    count: 2
    filters:
      author: ""
      category: ""
      exclude_featured: false
      exclude_future: false
      exclude_past: false
      folders:
      - post
      publication_type: ""
      tag: ""
    offset: 0
    order: desc
    subtitle: ""
    text: ""
    title: Recent Posts
  design:
    columns: "2"
    view: compact
  id: posts
- block: portfolio
  content:
    count: 5
    default_button_index: 0
    filters:
      folders:
      - project
    title: Projects
  design:
    columns: "4"
    view: showcase
  id: projects
- block: collection
  content:
    filters:
      featured_only: true
      folders:
      - publication
    title: Featured Publications
  design:
    columns: "2"
    view: card
  id: featured
- block: collection
  content:
    filters:
      exclude_featured: true
      folders:
      - publication
    text: |-
      {{% callout note %}}
      Quickly discover relevant content by [filtering publications](./publication/).
      {{% /callout %}}
    title: Recent Publications
  design:
    columns: "2"
    view: citation
- block: tag_cloud
  content:
    title: Popular Topics
  design:
    columns: "2"
- block: contact
  content:
    address:
      city: St Lucia
      country: Australia
      country_code: AU
      postcode: "4067"
      region: QLD
      street: 306 Carmody Road
    autolink: true
    email: bangyou.zheng@csiro.au
    phone: +61 7 3214 2620
    title: Contact
  design:
    columns: "2"
  id: contact
title: null
type: landing
---
