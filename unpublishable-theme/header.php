<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div class="site">
	<div class="shell<?php echo is_singular( 'post' ) ? ' letter-shell' : ''; ?>">
<?php if ( ! is_singular( 'post' ) ) : ?>
		<nav class="nav">
			<a class="wordmark" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a>
			<div class="nav-links">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Archive', 'unpublishable' ); ?></a>
				<?php
				$unpublishable_about = get_page_by_path( 'about' );
				if ( $unpublishable_about ) :
					?>
				<a href="<?php echo esc_url( get_permalink( $unpublishable_about ) ); ?>"><?php esc_html_e( 'About', 'unpublishable' ); ?></a>
				<?php endif; ?>
				<a href="<?php echo esc_url( unpublishable_subscribe_url() ); ?>"><?php esc_html_e( 'Subscribe', 'unpublishable' ); ?></a>
			</div>
		</nav>
<?php endif; ?>
