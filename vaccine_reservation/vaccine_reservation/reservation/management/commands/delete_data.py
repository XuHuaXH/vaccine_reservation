from django.core.management.base import BaseCommand, CommandError
from reservation.models import *
from reservation.generate_data import *


class Command(BaseCommand):
    help = 'delete all the test data'

    def add_arguments(self, parser):
        # parser.add_argument('poll_ids', nargs='+', type=int)
        pass

    def handle(self, *args, **options):
        delete_test_data()
        self.stdout.write(self.style.SUCCESS('Successfully deleted test data!'))
