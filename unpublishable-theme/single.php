<?php
/**
 * A single letter: back link, date, title, body, sign-off, and the
 * arrow to the next letter. No nav, no comments, no metadata beyond
 * the date — per the Correspondence direction.
 */
get_header();

while ( have_posts() ) :
	the_post();
	?>
		<a class="back" href="<?php echo esc_url( home_url( '/' ) ); ?>">&larr; <?php esc_html_e( 'Back', 'unpublishable' ); ?></a>
		<div class="letter-date"><?php echo esc_html( get_the_date( 'M j, Y' ) ); ?></div>
		<h1 class="letter-title"><?php the_title(); ?></h1>
		<div class="letter-body"><?php the_content(); ?></div>
		<p class="signoff"><?php echo esc_html( unpublishable_signoff() ); ?></p>
	<?php
	$unpublishable_next = unpublishable_next_letter();
	if ( $unpublishable_next ) :
		?>
		<footer class="end">
			<a href="<?php echo esc_url( get_permalink( $unpublishable_next ) ); ?>" aria-label="<?php echo esc_attr( sprintf( /* translators: %s: next letter title */ __( 'Next letter: %s', 'unpublishable' ), get_the_title( $unpublishable_next ) ) ); ?>">&rarr;</a>
		</footer>
		<?php
	endif;
endwhile;

get_footer();
