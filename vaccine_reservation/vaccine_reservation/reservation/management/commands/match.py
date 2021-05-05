from django.core.management.base import BaseCommand, CommandError
from reservation.models import *
from reservation.match import *


class Command(BaseCommand):
    help = 'Match patients to appointments'

    def add_arguments(self, parser):
        # parser.add_argument('poll_ids', nargs='+', type=int)
        pass

    def handle(self, *args, **options):
        match()
        self.stdout.write(self.style.SUCCESS('Finished matching.'))
