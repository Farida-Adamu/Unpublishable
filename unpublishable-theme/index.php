<?php
/**
 * Fallback template (archives, search, anything without its own file):
 * the same quiet list of letters.
 */
get_header();
?>
		<section class="list">
<?php
if ( have_posts() ) {
	while ( have_posts() ) {
		the_post();
		get_template_part( 'inc/letter-item' );
	}
} else {
	?>
			<p class="dek"><?php esc_html_e( 'Nothing here yet.', 'unpublishable' ); ?></p>
	<?php
}
?>
		</section>
<?php
get_footer();
