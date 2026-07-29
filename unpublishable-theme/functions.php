<?php
/**
 * Unpublishable — Correspondence theme setup.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'UNPUBLISHABLE_VERSION', '1.0.0' );

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/theme.css' );
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style(
		'unpublishable-fonts',
		'https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap',
		array(),
		null
	);
	wp_enqueue_style(
		'unpublishable',
		get_theme_file_uri( 'assets/theme.css' ),
		array( 'unpublishable-fonts' ),
		UNPUBLISHABLE_VERSION
	);
} );

/**
 * The homepage is the archive: every letter on one page, newest first.
 * Revisit (remove this and use the Reading settings) once the list
 * grows long enough to need pagination.
 */
add_action( 'pre_get_posts', function ( $query ) {
	if ( ! is_admin() && $query->is_main_query() && $query->is_home() ) {
		$query->set( 'posts_per_page', -1 );
	}
} );

// Letters don't take comments or pings — anywhere, ever.
add_filter( 'comments_open', '__return_false', 20 );
add_filter( 'pings_open', '__return_false', 20 );
add_filter( 'comments_array', '__return_empty_array', 20 );

/**
 * Content-model fields carried from the design data but not rendered
 * in this direction (kept for a future /archive view).
 */
add_action( 'init', function () {
	foreach ( array( '_essay_number', '_read_time_minutes' ) as $key ) {
		register_post_meta( 'post', $key, array(
			'type'          => 'integer',
			'single'        => true,
			'auth_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		) );
	}
} );

/**
 * The letter sign-off. Static across letters; a per-post
 * `_unpublishable_signoff` meta overrides it when present, and the
 * `unpublishable_signoff` filter has the last word.
 */
function unpublishable_signoff( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$custom  = $post_id ? get_post_meta( $post_id, '_unpublishable_signoff', true ) : '';
	$signoff = $custom ? $custom : "Yours, still logged in —\nThe Editor";
	return apply_filters( 'unpublishable_signoff', $signoff, $post_id );
}

/**
 * The next letter, reading top-down (newer → older), wrapping from
 * the oldest letter back to the newest. Returns null when this is
 * the only letter.
 */
function unpublishable_next_letter() {
	$next = get_previous_post();
	if ( ! $next instanceof WP_Post ) {
		$latest = get_posts( array( 'numberposts' => 1 ) );
		$next   = $latest ? $latest[0] : null;
	}
	if ( $next && (int) $next->ID === (int) get_the_ID() ) {
		return null;
	}
	return $next;
}

/**
 * The standfirst: the site tagline when set (Settings → General),
 * else the design default.
 */
function unpublishable_standfirst() {
	$tagline = get_bloginfo( 'description', 'display' );
	return $tagline ? $tagline : __( 'Letters about a changing world.', 'unpublishable' );
}

/**
 * The Subscribe link. Defaults to the RSS feed; point it at a
 * newsletter instead via:
 *   add_filter( 'unpublishable_subscribe_url', fn() => 'https://…' );
 */
function unpublishable_subscribe_url() {
	return apply_filters( 'unpublishable_subscribe_url', get_feed_link() );
}
