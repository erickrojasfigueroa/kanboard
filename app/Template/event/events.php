<?php if (empty($events)): ?>
    <p class="alert"><?= t('There is no activity yet.') ?></p>
<?php else: ?>

    <?php foreach ($events as $event): ?>
        <div class="activity-event">
            <p class="activity-datetime">
                <?php if ($this->text->contains($event['event_name'], 'subtask')): ?>
                    <i class="fa fa-tasks"></i>
                <?php elseif ($this->text->contains($event['event_name'], 'task.move')): ?>
                    <i class="fa fa-arrows-alt"></i>
                <?php elseif ($this->text->contains($event['event_name'], 'task')): ?>
                    <i class="fa fa-newspaper-o"></i>
                <?php elseif ($this->text->contains($event['event_name'], 'comment')): ?>
                    <i class="fa fa-comments-o"></i>
                <?php endif ?>
                &nbsp;<?= $this->dt->datetime($event['date_creation']) ?>
            </p>
            <div class="activity-content">
                <?= $this->user->avatar(
                    $event['creator_id'],
                    $event['author_username'],
                    $event['author_name'],
                    $event['email']
                ) ?>

                <?= $event['event_content'] ?>
            </div>
        </div>
    <?php endforeach ?>

<?php endif ?>